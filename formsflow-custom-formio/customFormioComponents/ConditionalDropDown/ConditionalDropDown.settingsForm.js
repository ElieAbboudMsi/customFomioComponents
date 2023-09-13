import baseEditForm from "formiojs/components/_classes/component/Component.form";

export default (...extend) => {

  return baseEditForm(
    [{
      label: 'Display',
      key: 'display',
      weight: 0,
      components: []
    },
    {
      label: 'Data',
      key: 'data',
      weight: 20,
      components: [

        {
          type: 'textfield',
          label: 'Conditional Key',
          key: 'conditionalKey',
          input: true,
          inline: true,
          validate: {
            required: true
          }
        },
        {
          type: 'select',
          label: 'Data Type',
          key: 'dataType',
          input: true,
          inline: true,
         
          data: {
            values: [
              {
                label: "Manual", value: "manual"
              },
              {
                label: "Request Url", value: "request"
              }

            ]
          }
        },


        {
          type: 'editgrid',
          label: 'Manual Conditions',
          key: 'conditionalValues',
        
          modal: true,
          input: true,
          inline: true,
          templates: {
            "header": "<div class=\"row\">\n      {% util.eachComponent(components, function(component) { %}\n        {% if (displayValue(component)) { %}\n          <div class=\"col-sm-3\">{{ t(component.label) }}</div>\n        {% } %}\n      {% }) %}\n    </div>",
            "tableHeader": "\n      <tr>\n        {% util.eachComponent(components, function(component) { %}\n          {% if (!component.hasOwnProperty('tableView') || component.tableView) { %}\n            <td class=\"editgrid-table-column\">{{ component.label }}</td>\n          {% } %}\n        {% }) %}\n        {% if (!instance.options.readOnly && !instance.disabled) { %}\n          <td class=\"editgrid-table-column\">Actions</td>\n        {% } %}\n      </tr>\n    ",
            "row": "<div class=\"row\">\n      {% util.eachComponent(components, function(component) { %}\n        {% if (displayValue(component)) { %}\n          <div class=\"col-sm-3\">\n            {{ isVisibleInRow(component) ? getView(component, row[component.key]) : ''}}\n          </div>\n        {% } %}\n      {% }) %}\n      {% if (!instance.options.readOnly && !instance.disabled) { %}\n        <div class=\"col-sm-3\">\n          <div class=\"btn-group pull-right\">\n            <button class=\"btn btn-default btn-light btn-sm editRow\"><i class=\"{{ iconClass('edit') }}\"></i></button>\n            {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}\n              <button class=\"btn btn-danger btn-sm removeRow\"><i class=\"{{ iconClass('trash') }}\"></i></button>\n            {% } %}\n          </div>\n        </div>\n      {% } %}\n    </div>",
            "tableRow": "\n      {% util.eachComponent(components, function(component) { %}\n          {% if (!component.hasOwnProperty('tableView') || component.tableView) { %}\n            <td class=\"editgrid-table-column\">\n              {{ getView(component, row[component.key]) }}\n            </td>\n          {% } %}\n        {% }) %}\n        {% if (!instance.options.readOnly && !instance.disabled) { %}\n          <td class=\"editgrid-table-column\">\n            <div class=\"btn-group\">\n              <button class=\"btn btn-default btn-light btn-sm editRow\" aria-label=\"{{ t('Edit row') }}\"><i class=\"{{ iconClass('edit') }}\"></i></button>\n              {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}\n              <button class=\"btn btn-danger btn-sm removeRow\" aria-label=\"{{ t('Remove row') }}\"><i class=\"{{ iconClass('trash') }}\"></i></button>\n              {% } %}\n            </div>\n          </td>\n        {% } %}\n    ",
            "footer": ""
          },
          components: [
            {
              key: "columns",
              type: "columns",
              columns: [
                {
                  width: 6,
                  currentWidth: 6,
                  components: [
                    {
                      type: 'textfield',
                      label: 'Value',
                      key: 'conditionalValue',
                      input: true,
                      inline: true,
                      logic: [
                        {
                          "name": "required",
                          "trigger": {
                            "type": "simple",
                            "simple": {
                              "show": true,
                              "when": "dataType",
                              "eq": "manual"
                            }
                          },
                          "actions": [
                            {
                              "name": "required",
                              "type": "property",
                              "property": {
                                "label": "Required",
                                "value": "validate.required",
                                "type": "boolean"
                              },
                              "state": true
                            }
                          ]
                        }
                      ],
                    },
                  ]
                },
                {
                  width: 6,
                  currentWidth: 6,
                  components: [
                    {
                      type: 'editgrid',
                      label: 'Options',
                      key: 'conditionalRenderedValues',
                      modal: true,
                      templates: {
                        "header": "<div class=\"row\">\n      {% util.eachComponent(components, function(component) { %}\n        {% if (displayValue(component)) { %}\n          <div class=\"col-sm-3\">{{ t(component.label) }}</div>\n        {% } %}\n      {% }) %}\n    </div>",
                        "tableHeader": "\n      <tr>\n        {% util.eachComponent(components, function(component) { %}\n          {% if (!component.hasOwnProperty('tableView') || component.tableView) { %}\n            <td class=\"editgrid-table-column\">{{ component.label }}</td>\n          {% } %}\n        {% }) %}\n        {% if (!instance.options.readOnly && !instance.disabled) { %}\n          <td class=\"editgrid-table-column\">Actions</td>\n        {% } %}\n      </tr>\n    ",
                        "row": "<div class=\"row\">\n      {% util.eachComponent(components, function(component) { %}\n        {% if (displayValue(component)) { %}\n          <div class=\"col-sm-3\">\n            {{ isVisibleInRow(component) ? getView(component, row[component.key]) : ''}}\n          </div>\n        {% } %}\n      {% }) %}\n      {% if (!instance.options.readOnly && !instance.disabled) { %}\n        <div class=\"col-sm-3\">\n          <div class=\"btn-group pull-right\">\n            <button class=\"btn btn-default btn-light btn-sm editRow\"><i class=\"{{ iconClass('edit') }}\"></i></button>\n            {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}\n              <button class=\"btn btn-danger btn-sm removeRow\"><i class=\"{{ iconClass('trash') }}\"></i></button>\n            {% } %}\n          </div>\n        </div>\n      {% } %}\n    </div>",
                        "tableRow": "\n      {% util.eachComponent(components, function(component) { %}\n          {% if (!component.hasOwnProperty('tableView') || component.tableView) { %}\n            <td class=\"editgrid-table-column\">\n              {{ getView(component, row[component.key]) }}\n            </td>\n          {% } %}\n        {% }) %}\n        {% if (!instance.options.readOnly && !instance.disabled) { %}\n          <td class=\"editgrid-table-column\">\n            <div class=\"btn-group\">\n              <button class=\"btn btn-default btn-light btn-sm editRow\" aria-label=\"{{ t('Edit row') }}\"><i class=\"{{ iconClass('edit') }}\"></i></button>\n              {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}\n              <button class=\"btn btn-danger btn-sm removeRow\" aria-label=\"{{ t('Remove row') }}\"><i class=\"{{ iconClass('trash') }}\"></i></button>\n              {% } %}\n            </div>\n          </td>\n        {% } %}\n    ",
                        "footer": ""
                      },
                      input: true,
                      inline: true,
                      components: [
                        {
                          key: "columns2",
                          type: "columns",
                          columns: [
                            {
                              width: 6,
                              currentWidth: 6,
                              components: [
                                {
                                  type: 'textfield',
                                  label: 'Label',
                                  key: 'conditionalRenderedLabel',
                                  input: true,
                                  inline: true,
                                  logic: [
                                    {
                                      "name": "required",
                                      "trigger": {
                                        "type": "simple",
                                        "simple": {
                                          "show": true,
                                          "when": "dataType",
                                          "eq": "manual"
                                        }
                                      },
                                      "actions": [
                                        {
                                          "name": "required",
                                          "type": "property",
                                          "property": {
                                            "label": "Required",
                                            "value": "validate.required",
                                            "type": "boolean"
                                          },
                                          "state": true
                                        }
                                      ]
                                    }
                                  ],
                                },
                              ]
                            },
                            {
                              width: 6,
                              currentWidth: 6,
                              components: [
                                {
                                  type: 'textfield',
                                  label: 'Value',
                                  key: 'conditionalRenderedValue',
                                  input: true,
                                  inline: true,
                                  logic: [
                                    {
                                      "name": "required",
                                      "trigger": {
                                        "type": "simple",
                                        "simple": {
                                          "show": true,
                                          "when": "dataType",
                                          "eq": "manual"
                                        }
                                      },
                                      "actions": [
                                        {
                                          "name": "required",
                                          "type": "property",
                                          "property": {
                                            "label": "Required",
                                            "value": "validate.required",
                                            "type": "boolean"
                                          },
                                          "state": true
                                        }
                                      ]
                                    }
                                  ],
                                },
                              ]
                            },

                          ]
                        }
                      ]
                    }
                  ]
                },

              ]
            }
          ]
        },
        {
          type: 'textfield',
          label: 'Fetch Request Url',
          key: 'requestUrl',
          input: true,
          inline: true,
          logic: [
            {
              "name": "required",
              "trigger": {
                "type": "simple",
                "simple": {
                  "show": true,
                  "when": "dataType",
                  "eq": "request"
                }
              },
              "actions": [
                {
                  "name": "required",
                  "type": "property",
                  "property": {
                    "label": "Required",
                    "value": "validate.required",
                    "type": "boolean"
                  },
                  "state": true
                }
              ]
            }
          ],
         
        },
        {
          type: 'textfield',
          label: 'Data Path',
          key: 'dataPath',
          input: true,
          inline: true,

        },
        {
          type: 'textfield',
          label: 'Label Name',
          key: 'labelName',
          input: true,
          inline: true,
          logic: [
            {
              "name": "required",
              "trigger": {
                "type": "simple",
                "simple": {
                  "show": true,
                  "when": "dataType",
                  "eq": "request"
                }
              },
              "actions": [
                {
                  "name": "required",
                  "type": "property",
                  "property": {
                    "label": "Required",
                    "value": "validate.required",
                    "type": "boolean"
                  },
                  "state": true
                }
              ]
            }
          ],

        },
        {
          type: 'textfield',
          label: 'Value Name',
          key: 'valueName',
          input: true,
          inline: true,
          logic: [
            {
              "name": "required",
              "trigger": {
                "type": "simple",
                "simple": {
                  "show": true,
                  "when": "dataType",
                  "eq": "request"
                }
              },
              "actions": [
                {
                  "name": "required",
                  "type": "property",
                  "property": {
                    "label": "Required",
                    "value": "validate.required",
                    "type": "boolean"
                  },
                  "state": true
                }
              ]
            }
          ],

        },
        {
          type: 'textfield',
          label: 'Field Name to Filter on',
          key: 'fieldFilterName',
          input: true,
          inline: true,
          logic: [
            {
              "name": "required",
              "trigger": {
                "type": "simple",
                "simple": {
                  "show": true,
                  "when": "dataType",
                  "eq": "request"
                }
              },
              "actions": [
                {
                  "name": "required",
                  "type": "property",
                  "property": {
                    "label": "Required",
                    "value": "validate.required",
                    "type": "boolean"
                  },
                  "state": true
                }
              ]
            }
          ],

        },
        {
          type: 'editgrid',
          label: 'Components To fill',
          key: 'componentsToFill',
          components: [
            {
              type: 'textfield',
              label: 'Field API',
              key: 'fieldApi',
              input: true,
              inline: true,
              validate: {
                required: true
              }
            },
          ]

        },
        {
          type: 'checkbox',
          label: 'Start Processing',
          key: 'startProcessing',
          input: true,
          inline: true,

        },
      ]
    },
    {
      label: 'Validation',
      key: 'validation',
      weight: 20,
      components: []
    }, {
      label: 'API',
      key: 'api',
      weight: 30,
      components: []
    }, {
      label: 'Logic',
      key: 'logic',
      weight: 50,
      components: []
    }, {
      label: 'Layout',
      key: 'layout',
      weight: 60,
      components: []
    }],
    ...extend
  );
};
