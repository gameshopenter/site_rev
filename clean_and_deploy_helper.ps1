<#
    clean_and_deploy_helper.ps1
    - Verwijdert/archveert kapotte submodule-referenties (site_rev / site_rev_backup)
    - Archiveert nested .git folders
    - Verwijdert/archveert .git/modules/* problematische entries
    - Voegt <meta charset="UTF-8"> toe en script-tag for uploads_inventory_wii_wiiu.js
    - Commit / push met interactieve handling bij push-fouten
    - Maakt ZIP in Downloads zonder .git
#>

param(
    [string]$ProjectRoot = "C:\Users\lenn\projects\site_rev"
)

Set-StrictMode -Version Latest

function FailIf([string]$msg) {
    Write-Host $msg -ForegroundColor Red
    exit 1
}

# Controleer projectmap
if (-not (Test-Path $ProjectRoot)) {
    FailIf "Projectmap niet gevonden: $ProjectRoot`nPas \$ProjectRoot bovenin het script aan en probeer opnieuw."
}

Set-Location $ProjectRoot
Write-Host "Werkmap: $ProjectRoot" -ForegroundColor Cyan
$timestamp = Get-Date -Format "yyyyMMddHHmmss"

# -------------------------
# 1) Backup .gitmodules
# -------------------------
if (Test-Path ".gitmodules") {
    $gmBak = ".gitmodules.bak.$timestamp"
    Copy-Item -Path ".gitmodules" -Destination $gmBak -Force
    Write-Host "Backup gemaakt van .gitmodules -> $gmBak" -ForegroundColor Green
} else {
    Write-Host "Geen .gitmodules bestand." -ForegroundColor Yellow
}

# -------------------------
# 2) Archiveer nested .git (subdir/.git)
# -------------------------
Write-Host "`nZoek nested .git folders..." -ForegroundColor Cyan
$nested = Get-ChildItem -Force -Directory | Where-Object { Test-Path (Join-Path $_.FullName ".git") }
if ($nested.Count -gt 0) {
    foreach ($d in $nested) {
        $gitPath = Join-Path $d.FullName ".git"
        $bak = "$gitPath.bak_$timestamp"
        try {
            Move-Item -LiteralPath $gitPath -Destination $bak -Force
            Write-Host "Gearchiveerd nested .git: $gitPath -> $bak" -ForegroundColor Green
        } catch {
            Write-Host "Fout bij verplaatsen $gitPath : $_" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "Geen nested .git gevonden." -ForegroundColor Yellow
}

# -------------------------
# 3) Verwerk .gitmodules - verwijder problematische submodules
# -------------------------
if (Test-Path ".gitmodules") {
    Write-Host "`nControleer .gitmodules op problematische secties..." -ForegroundColor Cyan
    $raw = Get-Content .gitmodules -Raw
    $pattern = '(?ms)\[submodule\s+"(?<name>[^"]+)"\]\s*(?<body>.*?)(?=(?:\[submodule\s+)|\z)'
    $regex = [regex]$pattern
    $matches = $regex.Matches($raw)
    $new = ""
    $removedAny = $false
    foreach ($m in $matches) {
        $name = $m.Groups['name'].Value
        $body = $m.Groups['body'].Value
        $pathLine = [regex]::Match($body, '^\s*path\s*=\s*(.+)\s*$', 'IgnoreCase|Multiline')
        $urlLine  = [regex]::Match($body, '^\s*url\s*=\s*(.+)\s*$',  'IgnoreCase|Multiline')
        $pathVal = if ($pathLine.Success) { $pathLine.Groups[1].Value.Trim() } else { "" }
        $urlVal  = if ($urlLine.Success)  { $urlLine.Groups[1].Value.Trim() } else { "" }

        # voorwaarden voor verwijderen: geen url of path is site_rev/site_rev_backup
        if ([string]::IsNullOrWhiteSpace($urlVal) -or $pathVal -in @("site_rev","site_rev_backup")) {
            Write-Host "Verwijder submodule sectie: name='$name' path='$pathVal' url='$urlVal'" -ForegroundColor Yellow
            $removedAny = $true
            try { git submodule deinit -f -- $pathVal 2>$null } catch {}
            try { git rm -f $pathVal 2>$null } catch {}
        } else {
            $new += "[submodule `"$name`"]`r`n" + $body
        }
    }

    if ($removedAny) {
        if ($new.Trim().Length -eq 0) {
            Remove-Item .gitmodules -Force
            Write-Host ".gitmodules was volledig problematisch en is verwijderd." -ForegroundColor Green
        } else {
            $new | Set-Content -Path .gitmodules -Encoding UTF8
            Write-Host ".gitmodules bijgewerkt (probleemsecties verwijderd)." -ForegroundColor Green
        }
    } else {
        Write-Host "Geen problematische submodule-secties gevonden." -ForegroundColor Yellow
    }
}

# -------------------------
# 4) Archiveer .git/modules/<name> indien aanwezig
# -------------------------
$modulesDir = Join-Path ".git" "modules"
if (Test-Path $modulesDir) {
    $modules = Get-ChildItem -Directory $modulesDir -ErrorAction SilentlyContinue
    foreach ($m in $modules) {
        if ($m.Name -in @("site_rev","site_rev_backup")) {
            $bak = "$($m.FullName).bak_$timestamp"
            try {
                Move-Item -LiteralPath $m.FullName -Destination $bak -Force
                Write-Host "Gearchiveerd .git/modules/$($m.Name) -> $bak" -ForegroundColor Green
            } catch {
                Write-Host "Kon .git/modules/$($m.Name) niet archiveren: $_" -ForegroundColor Yellow
            }
        }
    }
} else {
    Write-Host "Geen .git/modules map gevonden." -ForegroundColor Yellow
}

# -------------------------
# 5) Functie: voeg meta charset en script-tag toe
# -------------------------
function Ensure-Charset-And-Script {
    param([string]$FilePath)

    if (-not (Test-Path $FilePath)) {
        Write-Host "Bestand niet gevonden: $FilePath" -ForegroundColor Yellow
        return
    }

    try {
        $raw = Get-Content -Raw -Path $FilePath -ErrorAction Stop
    } catch {
        Write-Host "Kan $FilePath niet lezen: $_" -ForegroundColor Red
        return
    }

    $changed = $false

    # 1) <meta charset="UTF-8">
    if ($raw -notmatch '(?i)<meta\s+charset\s*=\s*["'']?utf-8["'']?\s*/?>') {
        # Voeg direct na <head> toe, of bovenaan als head niet vindbaar
        $new = [regex]::Replace($raw, '(?is)(<head[^>]*>)', '$1' + "`r`n    <meta charset=`"UTF-8`">", 1)
        if ($new -ne $raw) {
            $raw = $new
            Write-Host "Toegevoegd <meta charset=\"UTF-8\"> in $FilePath" -ForegroundColor Green
        } else {
            $raw = "<meta charset=`"UTF-8`">`r`n" + $raw
            Write-Host "Fallback: meta toegevoegd bovenaan $FilePath" -ForegroundColor Green
        }
        $changed = $true
    } else {
        Write-Host "Meta charset al aanwezig in $FilePath" -ForegroundColor Yellow
    }

    # 2) Voeg script-tag voor uploads_inventory_wii_wiiu.js ná uploads_inventory.js
    if ($raw -notmatch 'uploads_inventory_wii_wiiu.js') {
        if ($raw -match '(?is)<script[^>]+src\s*=\s*["'']uploads_inventory\.js["''][^>]*></script>') {
            $raw = [regex]::Replace($raw, '(?is)(<script[^>]+src\s*=\s*["'']uploads_inventory\.js["''][^>]*></script>)', '$1' + "`r`n    <script defer src=`"uploads_inventory_wii_wiiu.js`"></script>", 1)
            Write-Host "Script-tag toegevoegd ná uploads_inventory.js in $FilePath" -ForegroundColor Green
            $changed = $true
        } else {
            if ($raw -match '(?is)</head>') {
                $raw = $raw -replace '(?is)</head>', '    <script defer src="uploads_inventory_wii_wiiu.js"></script>' + "`r`n</head>"
                Write-Host "uploads_inventory.js niet gevonden; script-tag toegevoegd vóór </head> in $FilePath" -ForegroundColor Yellow
            } else {
                $raw += "`r`n    <script defer src=`"uploads_inventory_wii_wiiu.js`"></script>"
                Write-Host "Head niet gevonden; script-tag appended aan einde van $FilePath" -ForegroundColor Yellow
            }
            $changed = $true
        }
    } else {
        Write-Host "Script-tag voor uploads_inventory_wii_wiiu.js al aanwezig in $FilePath" -ForegroundColor Yellow
    }

    if ($changed) {
        # Schrijf file als UTF8
        Set-Content -Path $FilePath -Value $raw -Encoding UTF8
        Write-Host "Bestand opgeslagen als UTF-8: $FilePath" -ForegroundColor Green
    }
}

# Pas index.html en products.html aan
Ensure-Charset-And-Script -FilePath (Join-Path $ProjectRoot "index.html")
Ensure-Charset-And-Script -FilePath (Join-Path $ProjectRoot "products.html")

# -------------------------
# 6) Git: stage/commit/push met veilige handling
# -------------------------
Write-Host "`nStagen van wijzigingen..." -ForegroundColor Cyan
try { git add -A 2>$null } catch { Write-Host "Git add faalde: $_" -ForegroundColor Red }

# Commit
$commitMsg = "Cleanup broken submodules, add charset + wii/wiiu script"
try {
    git commit -m $commitMsg
    Write-Host "Commit gemaakt: $commitMsg" -ForegroundColor Green
} catch {
    Write-Host "Geen nieuwe wijzigingen om te committen of commit faalde." -ForegroundColor Yellow
}

# Push
Write-Host "`nProbeer push naar origin main..." -ForegroundColor Cyan
$pushOk = $false
try {
    git push origin main
    $pushOk = $true
    Write-Host "Push geslaagd." -ForegroundColor Green
} catch {
    Write-Host "Push mislukt: $($_.Exception.Message)" -ForegroundColor Yellow
    # Interactieve keuze
    Write-Host "`nKies actie om push-probleem op te lossen:" -ForegroundColor Cyan
    Write-Host "1) Haal remote en merge (git pull origin main --allow-unrelated-histories)" -ForegroundColor White
    Write-Host "2) Force push (git push -u origin main --force)  -- OVERSCHRIJFT remote!" -ForegroundColor Magenta
    Write-Host "3) Afbreken (geen push)" -ForegroundColor Yellow
    $choice = Read-Host "Voer 1, 2 of 3 in"

    if ($choice -eq "1") {
        try {
            git pull origin main --allow-unrelated-histories
            Write-Host "Pull afgerond. Los conflicten op indien aanwezig, daarna opnieuw commit/push." -ForegroundColor Green
            Write-Host "Probeer nu git add . ; git commit -m 'Resolve merge' ; git push origin main" -ForegroundColor Cyan
            # Probeer automatisch pushen
            try {
                git add -A
                git commit -m "Resolve merge conflicts via script" 2>$null
            } catch {}
            try { git push origin main; $pushOk = $true } catch { Write-Host "Automatische push na pull faalde." -ForegroundColor Yellow }
        } catch {
            Write-Host "Pull faalde: $_" -ForegroundColor Red
        }
    } elseif ($choice -eq "2") {
        $confirm = Read-Host "Weet je zeker? Dit overschrijft de remote geschiedenis. Typ YES om te bevestigen"
        if ($confirm -eq "YES") {
            try {
                git push -u origin main --force
                $pushOk = $true
                Write-Host "Force-push voltooid." -ForegroundColor Green
            } catch {
                Write-Host "Force-push faalde: $_" -ForegroundColor Red
            }
        } else {
            Write-Host "Force-push geannuleerd." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Push afgebroken op verzoek." -ForegroundColor Yellow
    }
}

# -------------------------
# 7) Maak ZIP zonder .git
# -------------------------
$zipDest = Join-Path $env:USERPROFILE "Downloads\site_rev_clean_$timestamp.zip"
Write-Host "`nMaak ZIP (zonder .git) naar: $zipDest" -ForegroundColor Cyan

try {
    # lijst bestanden exclusief .git
    $files = Get-ChildItem -Recurse -Force -File | Where-Object { $_.FullName -notmatch "\\.git(\\|$)" }
    if ($files.Count -eq 0) {
        Write-Host "Geen bestanden gevonden om te zippen. Controleer projectmap." -ForegroundColor Red
    } else {
        # Compress-Archive accepteert een array van paths
        $paths = $files | ForEach-Object { $_.FullName }
        Compress-Archive -LiteralPath $paths -DestinationPath $zipDest -Force
        Write-Host "ZIP aangemaakt: $zipDest" -ForegroundColor Green
    }
} catch {
    Write-Host "Fout bij zip maken: $_" -ForegroundColor Red
}

# Eindsamenvatting
Write-Host "`nKlaar. Samenvatting:" -ForegroundColor Cyan
if (Test-Path ".gitmodules.bak.$timestamp") { Write-Host "- Back-up .gitmodules: .gitmodules.bak.$timestamp" -ForegroundColor Green }
Write-Host "- Eventuele nested .git zijn gearchiveerd als .git.bak_TIMESTAMP in die subfolders (controleer output)." -ForegroundColor Green
Write-Host "- Eventuele .git/modules/site_rev* mappen zijn gearchiveerd." -ForegroundColor Green
Write-Host "- index.html / products.html aangepast (meta charset + script-tag) indien nodig." -ForegroundColor Green
if ($pushOk) { Write-Host "- Push naar origin main is gelukt." -ForegroundColor Green } else { Write-Host "- Push naar origin main is NIET voltooid. Zie boven voor opties." -ForegroundColor Yellow }
Write-Host "- ZIP-bestand: $zipDest" -ForegroundColor Cyan
Write-Host "`nControleer Netlify deploy logs of trigger handmatig upload (app.netlify.com/drop) met de ZIP indien gewenst." -ForegroundColor Cyan


Write-Host "Charset fix committed and pushed. Deploy will trigger automatically if Netlify is connected." -ForegroundColor Cyan