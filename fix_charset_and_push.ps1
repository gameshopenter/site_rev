<#!
# PowerShell script to insert a UTF‑8 charset meta tag into HTML files
# and push the changes to GitHub.
#
# This script does the following:
# 1. Navigates to the provided project root.
# 2. Ensures that `index.html` and `products.html` contain `<meta charset="UTF-8">` inside the `<head>` section.
# 3. Stages the modified files and commits them with a descriptive message.
# 4. Pushes the commit to the remote `main` branch.
# 5. (Optional) You can add a Netlify deploy command at the end if needed.
#>

param(
    [string]$ProjectRoot = "C:\\Users\\lenn\\projects\\site_rev"
)

function Ensure-CharsetTag {
    param(
        [string]$FilePath
    )
    if (-not (Test-Path $FilePath)) { return }
    $lines = Get-Content $FilePath
    $hasCharset = $false
    foreach ($ln in $lines) {
        if ($ln -match '<meta\s+charset') {
            $hasCharset = $true
            break
        }
    }
    if (-not $hasCharset) {
        $newLines = @()
        foreach ($ln in $lines) {
            $newLines += $ln
            if ($ln -match '<head>') {
                $newLines += '    <meta charset="UTF-8">'
            }
        }
        $newLines | Set-Content $FilePath -Encoding UTF8
        Write-Host "Inserted UTF-8 charset meta tag into $FilePath" -ForegroundColor Green
    } else {
        Write-Host "Charset meta tag already present in $FilePath" -ForegroundColor Yellow
    }
}

# Navigate to project root
Set-Location $ProjectRoot

# Ensure charset tag in HTML files
Ensure-CharsetTag -FilePath (Join-Path $ProjectRoot "index.html")
Ensure-CharsetTag -FilePath (Join-Path $ProjectRoot "products.html")

# Stage and commit
git add index.html products.html | Out-Host
git commit -m "Ensure UTF-8 charset meta tag in HTML files" | Out-Host

# Push to remote
git push origin main | Out-Host

Write-Host "Charset fix committed and pushed. Deploy will trigger automatically if Netlify is connected." -ForegroundColor Cyan