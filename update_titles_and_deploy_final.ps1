<#!
# PowerShell script to ensure Wii/Wii-U inventory script is linked in HTML files,
# commit the changes to GitHub, and deploy the site via Netlify.
#
# Steps performed:
# 1. Navigate to the project root directory.
# 2. Insert the script tag for uploads_inventory_wii_wiiu.js into index.html and products.html
#    if it does not already exist.
# 3. Stage and commit the modified files.
# 4. Push the changes to the remote Git repository.
# 5. Trigger a Netlify production deploy.

param(
    [string]$ProjectRoot = "C:\\Users\\lenn\\projects\\site_rev"
)

Write-Host "Updating HTML files and deploying site..." -ForegroundColor Cyan

# Helper function to insert script tag
function Ensure-ScriptTag {
    param(
        [string]$FilePath
    )
    if (-not (Test-Path $FilePath)) { return }
    $lines = Get-Content $FilePath
    $tagExists = $false
    foreach ($ln in $lines) {
        if ($ln -match 'uploads_inventory_wii_wiiu.js') {
            $tagExists = $true
            break
        }
    }
    if (-not $tagExists) {
        $newLines = @()
        $inserted = $false
        foreach ($ln in $lines) {
            $newLines += $ln
            if ($ln -match 'uploads_inventory.js' -and -not $inserted) {
                $newLines += '    <script defer src="uploads_inventory_wii_wiiu.js"></script>'
                $inserted = $true
            }
        }
        if (-not $inserted) {
            # Append at end
            $newLines += '    <script defer src="uploads_inventory_wii_wiiu.js"></script>'
        }
        $newLines | Set-Content $FilePath -Encoding UTF8
        Write-Host "Inserted script tag into $FilePath" -ForegroundColor Green
    } else {
        Write-Host "Script tag already present in $FilePath" -ForegroundColor Yellow
    }
}

Set-Location $ProjectRoot

Ensure-ScriptTag -FilePath (Join-Path $ProjectRoot "index.html")
Ensure-ScriptTag -FilePath (Join-Path $ProjectRoot "products.html")

# Stage and commit changes
git add index.html products.html uploads_inventory_wii_wiiu.js images\products\wii\* images\products\wiiu\* | Out-Host
git commit -m "Add Wii/Wii-U titles script and images" | Out-Host
git push origin main | Out-Host

# Deploy via Netlify
try {
    netlify deploy --prod --dir "." | Out-Host
} catch {
    Write-Host "Netlify deploy failed. Ensure Netlify CLI is installed and you are logged in." -ForegroundColor Red
}

Write-Host "Site update and deploy completed." -ForegroundColor Cyan