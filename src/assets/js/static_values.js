const osx_policy_header = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">`;
const osx_policy_template = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>PayloadContent</key>
        <array>
            <dict>
                <key>PayloadContent</key>
                <dict>
                    <key>com.google.Chrome</key>
                    <dict>
                        <key>Forced</key>
                        <array>
                            <dict>
                                <key>mcx_preference_settings</key>
                                <dict>
                                    <key>ExtensionSettings</key>
                                </dict>
                            </dict>
                        </array>
                    </dict>
                </dict>
                <key>PayloadDisplayName</key>
                <string>Chrome ExtensionSettings installation_mode example</string>
                <key>PayloadEnabled</key>
                <true />
                <key>PayloadIdentifier</key>
                <string>com.example.Chrome.example.installation_mode</string>
                <key>PayloadType</key>
                <string>com.apple.ManagedClient.preferences</string>
                <key>PayloadUUID</key>
                <string>{{REPLACE_ME_WITH_UUID}}</string>
                <key>PayloadVersion</key>
                <integer>1</integer>
            </dict>
        </array>
        <key>PayloadDescription</key>
        <string></string>
        <key>PayloadDisplayName</key>
        <string>TheHackerBlog.com ChromeGalvanizer Generated Policy</string>
        <key>PayloadIdentifier</key>
        <string>com.chromegalvanizer.generatedpolicy</string>
        <key>PayloadOrganization</key>
        <string>TheHackerBlog.com / @IAmMandatory</string>
        <key>PayloadRemovalDisallowed</key>
        <true />
        <key>PayloadScope</key>
        <string>System</string>
        <key>PayloadType</key>
        <string>Configuration</string>
        <key>PayloadUUID</key>
        <string>{{REPLACE_ME_WITH_UUID}}</string>
        <key>PayloadVersion</key>
        <integer>1</integer>
    </dict>
</plist>`;

const windows_policy_template = `Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\\Software\\Policies\\Google\\Chrome]
"ExtensionSettings"={{REPLACE_ME_WITH_EXTENSION_SETTINGS_POLICY}}`

const linux_policy_template = `#!/bin/bash
if [ $EUID -ne 0 ]; then
   echo "This script must be run as root (the Chrome policy location is writable only by root)." 
   exit 1
fi

# Create required policy directory structure
# See https://support.google.com/chrome/a/answer/7517525?hl=en for more info
mkdir -p /etc/opt/chrome/
mkdir -p /etc/opt/chrome/policies/
mkdir -p /etc/opt/chrome/policies/managed/

# Write policy to variable
read -r -d '' VAR << EOM
{{REPLACE_ME_WITH_POLICY_JSON}}
EOM

echo "$VAR" > /etc/opt/chrome/policies/managed/ChromeGalvanizerPolicy.json

echo "Policy written, your Chrome policy has been updated!"
`;

export {osx_policy_template, osx_policy_header, windows_policy_template, linux_policy_template}