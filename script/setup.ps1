$base = "/home/atari-monk/atari-monk/project/light-engine-procedural-testbed"

$folders = @(
    "$base/src",
    "$base/src/oop"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
        Write-Host "Created folder: $folder"
    }
    else {
        Write-Host "Folder already exists: $folder"
    }
}

$files = @(
    "$base/package.json",
    "$base/tsconfig.json",
    "$base/vite.config.ts",
    "$base/.gitignore",

    "$base/src/player.ts",
    "$base/src/game.ts"

    "$base/src/oop/player.ts",
    "$base/src/oop/game.ts"
)

foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
        Write-Host "Created file: $file"
    }
    else {
        Write-Host "File already exists: $file"
    }
}

Write-Host "light-engine-procedural-testbed structure check complete."