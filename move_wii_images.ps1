<#!
# PowerShell script to move Wii and Wii U game images into the correct folders
# within your site_rev project directory. Adjust $projectRoot if your project
# directory is located elsewhere.

param(
    [string]$projectRoot = "C:\\Users\\lenn\\projects\\site_rev"
)

Write-Host "Moving Wii/Wii U images into correct folders..." -ForegroundColor Cyan

# Define the destination directories for Wii and Wii U images
$wiiDir  = Join-Path $projectRoot "images\products\wii"
$wiiuDir = Join-Path $projectRoot "images\products\wiiu"

# Ensure destination directories exist
foreach ($dir in @($wiiDir, $wiiuDir)) {
    if (-not (Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory -Force | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Yellow
    }
}

# Move all PNG files beginning with IMG_ from the project root into the Wii folder
# Modify the filter or destination if you need to separate Wii and Wii U images manually.
$imagesToMove = Get-ChildItem -Path $projectRoot -Filter "IMG_*.png" -File
if ($imagesToMove.Count -gt 0) {
    foreach ($img in $imagesToMove) {
        Move-Item -Path $img.FullName -Destination $wiiDir -Force
        Write-Host "Moved $($img.Name) to $wiiDir" -ForegroundColor Green
    }
    Write-Host "Successfully moved $($imagesToMove.Count) image(s) to $wiiDir" -ForegroundColor Green
} else {
    Write-Host "No images matching IMG_*.png found in $projectRoot" -ForegroundColor Yellow
}

Write-Host "Image relocation script completed." -ForegroundColor Cyan