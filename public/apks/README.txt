APK FILES  ->  Supabase Storage, bucket "apks" (NOT this folder)
==============================================================

GitHub web upload limit is 25 MB, so big APKs must NOT go in the
repo. Upload them once to Supabase Storage instead (free, up to
50 MB per file):

  Supabase Dashboard -> Storage -> New bucket
    Name:   apks
    Public: ON

  Then upload each APK with EXACTLY these file names (all lowercase):

    freecharge.apk   ->  Freecharge APK
    phonepe.apk      ->  PhonePe APK
    mobikwik.apk     ->  Mobikwik APK
    paytm.apk        ->  Paytm APK
    hkwallet.apk     ->  Main app APK (landing page + /download)

IndusPay needs NO apk. In IndusPay the user only enters the UPI
number / handle and the wallet is set up directly, so no download
button is shown for it.

The Download / Install buttons are already wired to read from the
`apks` bucket. The moment a file with the name above exists in the
bucket, the button serves it automatically. Nothing else has to be
changed in the code. Files in this folder (if any) are ignored.
