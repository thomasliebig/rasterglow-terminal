$ErrorActionPreference = 'Stop'
$csc = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
$probe = Join-Path $env:TEMP "RasterGlow-WinInputProbe-$PID.exe"
try {
    & $csc /nologo /optimize+ /target:exe "/out:$probe" (Join-Path $PSScriptRoot 'WinInputProbe.cs')
    $code = $LASTEXITCODE
    if (-not $code) {
        $env:RASTERGLOW_TEST_PROBE = $probe
        & node (Join-Path $PSScriptRoot 'test-conpty-wininput.cjs')
        $code = $LASTEXITCODE
    }
} finally {
    Remove-Item -LiteralPath $probe -Force -ErrorAction SilentlyContinue
}
exit $code
