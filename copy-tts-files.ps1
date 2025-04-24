# Create the destination directory
New-Item -ItemType Directory -Force -Path "public/talking-head-tts-version-0.01"
New-Item -ItemType Directory -Force -Path "public/talking-head-tts-version-0.01/modules"

# Copy files
Copy-Item "talking-head-tts-version-0.01/Animate.glb" -Destination "public/talking-head-tts-version-0.01/"
Copy-Item "talking-head-tts-version-0.01/kokorotts.mjs" -Destination "public/talking-head-tts-version-0.01/"
Copy-Item "talking-head-tts-version-0.01/modules/*" -Destination "public/talking-head-tts-version-0.01/modules/" -Recurse 