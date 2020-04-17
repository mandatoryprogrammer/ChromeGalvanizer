<template>
    <div>
        <b-card no-body class="main mb-4">
            <template v-slot:header>
                <h1 class="mb-0">
                    <img src="../assets/img/CG-icon.png" style="width: 64px; margin-bottom: 10px;" />
                    Chrome Galvanizer
                </h1>
                <i>Harden your Chrome browser via enterprise policy.</i>
            </template>
            <b-card-body>
                <b-input-group prepend="Policy Type to Add" class="mb-2 mr-sm-2 mb-sm-0">
                    <b-form-select v-model="policy_type_selected" :options="policy_type_options_select"></b-form-select>
                </b-input-group>
                <hr />
                <!-- When nothing is selected -->
                <div class="mt-2" v-if="policy_type_selected === null">
                    <h3><i>Select a policy type to add from the menu above to begin.</i></h3>
                </div>
                <!-- block URLs Builder -->
                <div v-if="policy_type_selected === 'runtime_blocked_hosts'" class="mt-4">
                    <h2>Block Extension URL Access</h2>
                    <i>Prevent an extension from having access to a specific set of URL(s), even if you allow the access during extension installation. This is done via URL patterns <b>without the path portion of the pattern</b>. For example URL patterns, <a target="_blank" href="https://developer.chrome.com/extensions/match_patterns">click here.</a></i>
                    <b-input-group prepend="Extension ID(s)" class="mt-4 mb-2 mr-sm-2 mb-sm-0">
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" placeholder="aohghmighlieiainnegkcijnfilokake" v-model="policy_settings.runtime_blocked_hosts.extension_id" :state="runtime_blocked_hosts_extension_id_valid" autofocus></b-input>
                        <b-form-invalid-feedback :state="runtime_blocked_hosts_extension_id_valid">
                            Extension ID must match the proper extension ID format (32 lowercase-ASCII characters) or be a wildcard (<code>*</code>).
                        </b-form-invalid-feedback>
                    </b-input-group>
                    <b-alert show class="mt-1 mb-2">
                        <font-awesome-icon :icon="['fas', 'info-circle']" class="icon alt" /> <i>Multiple extension IDs should be comma-separated. To disable a permission for all extensions, just enter <code>*</code> above.</i>
                    </b-alert>
                    <b-input-group prepend="URL Pattern to Block" class="mb-2 mr-sm-2 mb-sm-0">
                        <b-input id="runtime_blocked_hosts_url_pattern_input" class="mb-2 mr-sm-2 mb-sm-0" placeholder="*://mail.google.com" v-model="policy_settings.runtime_blocked_hosts.url_pattern" :state="runtime_blocked_hosts_url_pattern_valid"></b-input>
                        <b-form-invalid-feedback :state="runtime_blocked_hosts_url_pattern_valid">
                            URL pattern must be a valid Chrome URL pattern without the host portion, <a href="https://developer.chrome.com/extensions/match_patterns" target="_blank">click here for more information.</a>
                        </b-form-invalid-feedback>
                    </b-input-group>
                    <b-button class="mt-2" block size="lg" variant="primary" v-on:click="add_runtime_blocked_hosts_policy" :disabled="!runtime_blocked_hosts_url_pattern_valid|| !runtime_blocked_hosts_extension_id_valid">
                        <font-awesome-icon :icon="['fas', 'plus-circle']" class="icon alt" /> Add Rule to Policy
                    </b-button>
                </div>
            </b-card-body>
        </b-card>
        <b-card no-body class="main mb-5">
            <template v-slot:header>
                <h2 class="mb-0">
                    <font-awesome-icon :icon="['fas', 'scroll']" class="icon alt" />
                    Generated Policy
                </h2>
                <i>This is a preview of your generated Chrome policy.</i>
            </template>
            <b-list-group flush>
                <b-list-group-item v-if="policy_rules.length === 0">
                    <i>No policy rules defined yet, add some rules to get download buttons for your policy.</i>
                </b-list-group-item>
                <b-list-group-item v-for="(policy_rule, index) in policy_rules" v-bind:key="index">
                    {{policy_rule.description}}
                </b-list-group-item>
            </b-list-group>
            <b-card-body v-if="policy_rules.length > 0">
                <h3>Select your OS to get an appropriate policy to apply:</h3>
                <b-button variant="primary" class="download-policy-buttons m-2 pr-3 pl-4" v-on:click="download_windows_policy">
                    <font-awesome-icon :icon="['fab', 'windows']" class="icon alt" /> Windows
                </b-button>
                <b-button variant="primary" class="download-policy-buttons m-2 pr-3 pl-4" v-on:click="download_mac_policy">
                    <font-awesome-icon :icon="['fab', 'apple']" class="icon alt" /> Mac
                </b-button>
                <b-button variant="primary" class="download-policy-buttons m-2 pr-3 pl-4">
                    <font-awesome-icon :icon="['fab', 'linux']" class="icon alt" /> Linux
                </b-button>
            </b-card-body>
        </b-card>
    </div>
</template>
<script>
import { osx_policy_template, osx_policy_header, windows_policy_template } from '../assets/js/static_values';

function copy(input_data) {
  return JSON.parse(
    JSON.stringify(
      input_data
    )
  );
}

export default {
    name: 'HelloWorld',
    props: {},
    data() {
        // Make debugging suck less
        window.app = this;

        return {
            policy_settings: {
                runtime_blocked_hosts: {
                    extension_id: '',
                    url_pattern: '',
                }
            },
            policy_rules: [],
            policy_type_selected: 'runtime_blocked_hosts',
            policy_type_options_select: [{
                    value: null,
                    text: '-- Please select a policy type to add --'
                },
                {
                    value: 'runtime_blocked_hosts',
                    text: 'Block access to URL(s) for a set of extensions.'
                },
            ],
        }
    },
    methods: {
        download_windows_policy() {
          var policy_template = copy(windows_policy_template);

          // Process runtime_blocked_hosts rule(s)
          const runtime_blocked_hosts_rules = this.policy_rules.filter(policy_rule => {
            return policy_rule.policy_type === 'runtime_blocked_hosts';
          });
          var registry_blocked_hosts_policy_object = get_policy_object_from_blocked_host_policy_rules(
            runtime_blocked_hosts_rules
          );
          Object.keys(registry_blocked_hosts_policy_object).map(extension_id => {
            registry_blocked_hosts_policy_object[extension_id] = {
              'runtime_blocked_hosts': registry_blocked_hosts_policy_object[extension_id]
            }
          });

          policy_template = policy_template.replace(
            '{{REPLACE_ME_WITH_EXTENSION_SETTINGS_POLICY}}',
            JSON.stringify(JSON.stringify(registry_blocked_hosts_policy_object))
          );

          console.log(`Final windows policy:`);
          console.log(policy_template);

          download_file(
            policy_template,
            'ChromeGalvanizerPolicy.reg',
            'text/plain'
          );
        },
        download_mac_policy() {
          // Generate Mac policy
          // Update UUIDs in policy to be new random ones.
          var policy_template = copy(osx_policy_template).replace(
            '{{REPLACE_ME_WITH_UUID}}',
            uuid()
          ).replace(
            '{{REPLACE_ME_WITH_UUID}}',
            uuid()
          );

          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(policy_template, "text/xml");

          // Process runtime_blocked_hosts rule(s)
          const runtime_blocked_hosts_rules = this.policy_rules.filter(policy_rule => {
            return policy_rule.policy_type === 'runtime_blocked_hosts';
          });
          xmlDoc = add_runtime_blocked_hosts_to_xml_from_policy_list(
            xmlDoc,
            runtime_blocked_hosts_rules
          );

          var final_xml_string = osx_policy_header + xmlDoc.documentElement.outerHTML;

          download_file(
            final_xml_string,
            'ChromeGalvanizerPolicy.mobileconfig',
            'text/xml'
          );
        },
        add_runtime_blocked_hosts_policy() {
            const target_config = this.policy_settings.runtime_blocked_hosts;

            const policy = target_config.extension_id.split(',').map(extension_id => {
                return [
                  extension_id,
                  target_config.url_pattern
                ]
            })

            this.add_policy_to_policy_list(
                'runtime_blocked_hosts',
                `Block access to URL(s) '${target_config.url_pattern}' from extensions with the following ID(s) ${target_config.extension_id}`,
                policy
            );

            // Re-select the URL pattern to block field
            document.getElementById("runtime_blocked_hosts_url_pattern_input").select();
        },
        add_policy_to_policy_list(policy_type, text_description, policy_value) {
            this.policy_rules.push({
                'policy_type': policy_type,
                'policy_value': policy_value,
                'description': text_description,
            });
        }
    },
    computed: {
        /*
          For validation an extension ID for the runtime_blocked_hosts field
        */
        runtime_blocked_hosts_extension_id_valid() {
            const entered_value = this.policy_settings.runtime_blocked_hosts.extension_id;

            if (entered_value.length === 0) {
                return null;
            }

            if (entered_value === '*') {
                return true;
            }

            const matches = entered_value.match(/^[a-z]{32}$/g);

            // Type issue
            return !!matches;
        },
        /*
          Validating a URL pattern for runtime_blocked_hosts is the correct format.
        */
        runtime_blocked_hosts_url_pattern_valid() {
            // Special regex that only matches the runtime_blocked_hosts format
            const url_pattern_regex = /^(?:(?:\*|http|https|file|ftp|chrome-extension):\/\/(?:\*|\*\.[^/*]+|[^/*]+)?)$/;

            const entered_value = this.policy_settings.runtime_blocked_hosts.url_pattern;

            if (entered_value.length === 0) {
                return null;
            }

            if (entered_value.match(url_pattern_regex)) {
                return true;
            }

            return false;
        }
    }
}

function get_policy_object_from_blocked_host_policy_rules(policy_rules) {
  /*
    First generate a struct like:
    {
      '{{extension_id}}': [{{array_of_all_hosts}}]
    }
  */
  var policy_object = {};
  policy_rules.map(policy_rule => {
    const policy_value_array = policy_rule.policy_value;

    policy_value_array.map(policy_value => {
      const extension_id = policy_value[0];
      const url_pattern = policy_value[1];

      // Ensure key exists
      if(!(extension_id in policy_object)) {
        policy_object[extension_id] = [];
      }

      policy_object[extension_id].push(url_pattern);
    });
  });

  // Ensure values are unique arrays of URL patterns
  Object.keys(policy_object).map(extension_id => {
    policy_object[extension_id] = unique(policy_object[extension_id]);
  });

  return policy_object;
}

function add_runtime_blocked_hosts_to_xml_from_policy_list(policy_xml_doc, policy_rules) {
  // Find <key>ExtensionSettings</key> and get the parent elem
  // so we have a proper point of injection.
  var key_elems = Array.from(policy_xml_doc.getElementsByTagName('key'));
  var target_node = null;
  key_elems.map(key_elem => {
    if(key_elem.innerHTML === 'ExtensionSettings') {
      target_node = key_elem;
    }
  });
  target_node = target_node.parentElement;

  // Generate ExtensionSettings <dict> element
  var extension_settings_element = document.createElement('dict');

  var policy_object = get_policy_object_from_blocked_host_policy_rules(
    policy_rules
  );

  console.log(`Policy object: `);
  console.log(policy_object);

  // Iterate through policy_object and add appropriate elements
  Object.keys(policy_object).map(extension_id => {
    // First append <key> element
    var key_elem = document.createElement('key');
    key_elem.innerText = extension_id;
    extension_settings_element.appendChild(key_elem);

    // Then append <dict> elem
    var dict_elem = string_to_dom_element(`<dict>
  <key>runtime_blocked_hosts</key>
</dict>`);

    // Create <array> element to append to above <dict>
    var array_elem = document.createElement('array');
    policy_object[extension_id].map(url_pattern => {
      var string_elem = document.createElement('string');
      string_elem.innerText = url_pattern;
      array_elem.appendChild(string_elem)
    });

    dict_elem.appendChild(array_elem);
    extension_settings_element.appendChild(dict_elem);
  });

  target_node.appendChild(
    extension_settings_element
  );

  return policy_xml_doc;
}

function unique(input_array) {
  return input_array.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
}

function string_to_dom_element(input_string) {
  var dom_elem = new DOMParser().parseFromString(
    input_string,
    "text/xml"
  );
  return dom_elem.firstChild;
}

function download_file(data, file_name, type="text/plain") {
  const a = document.createElement("a");
  a.style.display = "none";
  document.body.appendChild(a);
  a.href = window.URL.createObjectURL(
    new Blob([data], { type })
  );
  a.setAttribute("download", file_name);
  a.click();
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
}

function uuid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
    margin: auto;
    width: 100%;
    max-width: 600px !important;
}

.download-policy-buttons {
    font-size: 32px !important;
}

.invalid-feedback {
    font-weight: bold;
    font-size: 16px
}
</style>