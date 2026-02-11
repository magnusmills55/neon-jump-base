$env:Path += ";C:\Program Files\nodejs"

Write-Host "Starting Neon Jump Base..."
cd packages/app
if (!(Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..."
    & "C:\Program Files\nodejs\npm.cmd" install
}

Write-Host "Starting Frontend..."
& "C:\Program Files\nodejs\npm.cmd" run dev
