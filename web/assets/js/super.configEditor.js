$(document).ready(function () {
  var schema = {
    "title": "Main Configuration",
    "type": "object",
    "properties": {
      "debugLog": {
        "title": "Enable Debug Log",
        "type": "boolean",
        "default": false
      },
      "subscriptionId": {
        "title": "Fill in subscription ID",
        "type": "string",
        "default": null
      },
      "port": {
        "title": "Server port",
        "type": "integer",
        "default": 8080
      },
      "passwordType": {
        "title": "Password type",
        "type": "string",
        "enum": [
          "sha256",
          "sha512",
          "md5"
        ],
        "default": "sha256"
      },
      "addStorage": {
        "type": "array",
        "format": "table",
        "title": "Additional Storage",
        "description": "Separate storage locations that can be set for different monitors.",
        "uniqueItems": true,
        "items": {
          "type": "object",
          "title": "Storage Array",
          "properties": {
            "name": {
              "type": "string",
            },
            "path": {
              "type": "string",
              "default": "__DIR__/videos2"
            }
          }
        },
        "default": [
          {
            "name": "second",
            "path": "__DIR__/videos2"
          }
        ]
      },
      "plugins": {
        "type": "array",
        "format": "table",
        "title": "Plugins",
        "descripton": "Elaborate Plugin connection settings.",
        "uniqueItems": true,
        "items": {
          "type": "object",
          "title": "Plugin",
          "properties": {
            "plug": {
              "type": "string",
              "default": "pluginName"
            },
            "key": {
              "type": "string"
            },
            "mode": {
              "type": "string",
              "enum": [
                "host",
                "client"
              ],
              "default": "client"
            },
            "https": {
              "type": "boolean",
              "descripton": "Only for Host mode.",
              "default": false
            },
            "host": {
              "type": "string",
              "descripton": "Only for Host mode.",
              "default": "localhost"
            },
            "port": {
              "type": "integer",
              "descripton": "Only for Host mode.",
              "default": 8082
            },
            "type": {
              "type": "string",
              "default": "detector"
            }
          }
        }
      },
      "pluginKeys": {
        "type": "object",
        "format": "table",
        "title": "Plugin Keys",
        "description": "Quick client connection setup for plugins. Just add the plugin key to make it ready for incoming connections.",
        "uniqueItems": true,
        "items": {
          "type": "object",
          "title": "Plugin Key",
          "properties": {}
        }
      },
      "db": {
        "type": "object",
        "format": "table",
        "title": "Database Options",
        "description": "Credentials to connect to where detailed information is stored.",
        "properties": {
          "host": {
            "title": "Hostname / IP",
            "type": "string",
            "default": "127.0.0.1"
          },
          "user": {
            "title": "Username",
            "type": "string",
            "default": "majesticflame"
          },
          "password": {
            "title": "Password",
            "type": "string",
            "default": ""
          },
          "database": {
            "type": "string",
            "default": "ccio"
          },
          "port": {
            "type": "integer",
            "default": 3306
          }
        },
        "default": {
          "host": "127.0.0.1",
          "user": "majesticflame",
          "password": "",
          "database": "ccio",
          "port": 3306
        }
      },
      "cron": {
        "type": "object",
        "format": "table",
        "title": "CRON Options",
        "properties": {
          "key": {
            "type": "string",
          },
          "deleteOld": {
            "type": "boolean",
            "description": "cron will delete videos older than Max Number of Days per account.",
            "default": true
          },
          "deleteNoVideo": {
            "type": "boolean",
            "description": "cron will delete SQL rows that it thinks have no video files.",
            "default": true
          },
          "deleteOverMax": {
            "type": "boolean",
            "description": "cron will delete files that are over the set maximum storage per account.",
            "default": true
          },
        }
      },
      "mail": {
        "type": "object",
        "format": "table",
        "title": "Email Options",
        "properties": {
          "service": {
            "type": "string",
          },
          "host": {
            "type": "string",
          },
          "auth": {
            "type": "object",
            "properties": {
              "user": {
                "type": "string",
              },
              "pass": {
                "type": "string",
              },
            },
          },
          "secure": {
            "type": "boolean",
            "default": false
          },
          "ignoreTLS": {
            "type": "boolean",
          },
          "requireTLS": {
            "type": "boolean",
          },
          "port": {
            "type": "integer",
          }
        }
      },
      "detectorMergePamRegionTriggers": {
        "type": "boolean",
        "default": true
      },
      "doSnapshot": {
        "type": "boolean",
        "default": true
      },
      "discordBot": {
        "type": "boolean",
        "default": false
      },
      "dropInEventServer": {
        "type": "boolean",
        "default": false
      },
      "ftpServer": {
        "type": "boolean",
        "default": false
      },
      "oldPowerVideo": {
        "type": "boolean",
        "default": false
      },
      "wallClockTimestampAsDefault": {
        "type": "boolean",
        "default": true
      },
      "defaultMjpeg": {
        "type": "string",
      },
      "streamDir": {
        "type": "string",
      },
      "videosDir": {
        "type": "string",
      },
      "windowsTempDir": {
        "type": "string",
      },
      "enableFaceManager": {
        "type": "boolean",
        "default": false,
        "title": "Enable Face Manager",
        "description": "Enable / Disable face manager for face recognition plugins in the dashboard."
      }
    }
  };

  const configurationTab = $("#config");
  const configurationForm = configurationTab.find("form");

  const moduleData = {
    endpoint: null,
    configurationEditor: null
  }

  const handleGetConfigurationData = data => {
    const dataConfig = data.config;
    const dataConfigKeys = Object.keys(dataConfig);
    const schemaItemsKeys = Object.keys(schema.properties);

    const schemaWithoutData = schemaItemsKeys.filter(
      (sk) => !dataConfigKeys.includes(sk)
    );
    const dataWithoutSchema = dataConfigKeys.filter(
      (dk) => !schemaItemsKeys.includes(dk)
    );

    schemaWithoutData.forEach((sk) => {
      const schemaItem = schema.properties[sk];
      const defaultConfig = schemaItem.default;

      data.config[sk] = defaultConfig;
    });

    if (dataWithoutSchema.length > 0) {
      dataWithoutSchema.forEach((dk) => {
        const schemaItem = {
          title: dk,
          options: {
            hidden: true,
          },
        };

        schema.properties[dk] = schemaItem;
      });

      // Set default options
      JSONEditor.defaults.options.theme = "bootstrap3";
      JSONEditor.defaults.options.iconlib = "fontawesome4";
    }

    const configurationEditor = new JSONEditor(
      document.getElementById("configForHumans"), {
      schema: schema,
    }
    );

    configurationEditor.setValue(data.config);

    moduleData.configurationEditor = configurationEditor;
    window.configurationEditor = configurationEditor;
  };

  const handlePostConfigurationData = data => {
    // console.log(data);
  }

  function loadConfiguationIntoEditor(d) {
    moduleData.endpoint = `${superApiPrefix}${$user.sessionKey}/system/configure`;

    $.get(moduleData.endpoint, handleGetConfigurationData);
  }

  var submitConfiguration = function () {
    var errors = configurationEditor.validate();
    console.log(errors.length)
    console.log(errors)
    if (errors.length === 0) {
      var newConfiguration = JSON.stringify(configurationEditor.getValue(), null, 3)
      var html = '<p>This is a change being applied to the configuration file (conf.json). Are you sure you want to do this? You must restart Shinobi for these changes to take effect. <b>The JSON below is what you are about to save.</b></p>'
      html += `<pre>${newConfiguration}</pre>`
      $.confirm.create({
        title: 'Save Configuration',
        body: html,
        clickOptions: {
          class: 'btn-success',
          title: lang.Save,
        },
        clickCallback: function () {
          const requestData = {
            data: newConfiguration
          };

          $.post(moduleData.endpoint, requestData, handlePostConfigurationData);
        }
      })
    } else {
      new PNotify({ text: 'Invalid JSON Syntax, Cannot Save.', type: 'error' });
    }
  };

  configurationTab.find('.submit').click(function () {
    submitConfiguration();
  });

  configurationForm.submit(function (e) {
    e.preventDefault();
    submitConfiguration();
    return false;
  });

  $.ccio.ws.on("f", d => {
    if (d.f === "init_success") {
      loadConfiguationIntoEditor();
    }
  });

  window.configurationEditor = configurationEditor;
})
