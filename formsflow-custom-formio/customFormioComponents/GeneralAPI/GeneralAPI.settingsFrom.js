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
                    type: 'select',
                    label: 'Request Method',
                    key: 'requestMethod',
                    input: true,
                    data: {
                        values: [{ label: "GET", value: "GET" }, { label: "POST", value: "POST" }]
                    },
                    validate: {
                        required: true
                    }
                },
                {
                    type: 'textfield',
                    label: 'Data Path',
                    key: 'dataPath',
                    input: true,

                },
                {
                    type: 'textfield',
                    label: 'Request Url',
                    key: 'requestUrl',
                    input: true,
                    tooltip: "Wrap the variables you want to set their values later within {var}",
                    validate: {
                        required: true
                    }
                },
                {
                    type: 'editgrid',
                    label: 'Request Params Fields',
                    key: 'paramsGrid',
                    input: true,
                    inline: true,
                    templates: {
                        "header": "<div class=\"row\">\n      {% util.eachComponent(components, function(component) { %}\n        {% if (displayValue(component)) { %}\n          <div class=\"col-sm-4\">{{ t(component.label) }}</div>\n        {% } %}\n      {% }) %}\n    </div>",
                        "tableHeader": "\n      <tr>\n        {% util.eachComponent(components, function(component) { %}\n          {% if (!component.hasOwnProperty('tableView') || component.tableView) { %}\n            <td class=\"editgrid-table-column\">{{ component.label }}</td>\n          {% } %}\n        {% }) %}\n        {% if (!instance.options.readOnly && !instance.disabled) { %}\n          <td class=\"editgrid-table-column\">Actions</td>\n        {% } %}\n      </tr>\n    ",
                        "row": "<div class=\"row\">\n      {% util.eachComponent(components, function(component) { %}\n        {% if (displayValue(component)) { %}\n          <div class=\"col-sm-4\">\n            {{ isVisibleInRow(component) ? getView(component, row[component.key]) : ''}}\n          </div>\n        {% } %}\n      {% }) %}\n      {% if (!instance.options.readOnly && !instance.disabled) { %}\n        <div class=\"col-sm-4\">\n          <div class=\"btn-group pull-right\">\n            <button class=\"btn btn-default btn-light btn-sm editRow\"><i class=\"{{ iconClass('edit') }}\"></i></button>\n            {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}\n              <button class=\"btn btn-danger btn-sm removeRow\"><i class=\"{{ iconClass('trash') }}\"></i></button>\n            {% } %}\n          </div>\n        </div>\n      {% } %}\n    </div>",
                        "tableRow": "\n      {% util.eachComponent(components, function(component) { %}\n          {% if (!component.hasOwnProperty('tableView') || component.tableView) { %}\n            <td class=\"editgrid-table-column\">\n              {{ getView(component, row[component.key]) }}\n            </td>\n          {% } %}\n        {% }) %}\n        {% if (!instance.options.readOnly && !instance.disabled) { %}\n          <td class=\"editgrid-table-column\">\n            <div class=\"btn-group\">\n              <button class=\"btn btn-default btn-light btn-sm editRow\" aria-label=\"{{ t('Edit row') }}\"><i class=\"{{ iconClass('edit') }}\"></i></button>\n              {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}\n              <button class=\"btn btn-danger btn-sm removeRow\" aria-label=\"{{ t('Remove row') }}\"><i class=\"{{ iconClass('trash') }}\"></i></button>\n              {% } %}\n            </div>\n          </td>\n        {% } %}\n    ",
                        "footer": ""
                    },
                    components: [
                        {
                            type: 'columns',
                            label: 'Data',
                            key: 'columns',
                            input: true,
                            inline: true,
                            columns: [


                                {
                                    currentWidth: 6,
                                    width: 6,
                                    components: [
                                        {
                                            type: 'textfield',
                                            label: 'Field Name',
                                            key: 'paramsFieldName',
                                            input: true,
                                            inline: true,
                                            validate: {
                                                required: true
                                            }
                                        },
                                    ]
                                },

                                {
                                    currentWidth: 6,
                                    width: 6,
                                    components: [
                                        {
                                            type: 'textfield',
                                            label: 'Field Local Storage Path',
                                            key: 'paramsFieldPath',
                                            input: true,
                                            inline: true,
                                            validate: {
                                                required: true
                                            }

                                        },
                                    ]
                                }
                            ]
                        },
                    ]
                },

                {
                    type: 'editgrid',
                    label: 'Request Header Fields',
                    key: 'headersGrid',
                    input: true,
                    inline: true,
                    templates: {
                        "header": "<div class=\"row\">\n      {% util.eachComponent(components, function(component) { %}\n        {% if (displayValue(component)) { %}\n          <div class=\"col-sm-4\">{{ t(component.label) }}</div>\n        {% } %}\n      {% }) %}\n    </div>",
                        "tableHeader": "\n      <tr>\n        {% util.eachComponent(components, function(component) { %}\n          {% if (!component.hasOwnProperty('tableView') || component.tableView) { %}\n            <td class=\"editgrid-table-column\">{{ component.label }}</td>\n          {% } %}\n        {% }) %}\n        {% if (!instance.options.readOnly && !instance.disabled) { %}\n          <td class=\"editgrid-table-column\">Actions</td>\n        {% } %}\n      </tr>\n    ",
                        "row": "<div class=\"row\">\n      {% util.eachComponent(components, function(component) { %}\n        {% if (displayValue(component)) { %}\n          <div class=\"col-sm-4\">\n            {{ isVisibleInRow(component) ? getView(component, row[component.key]) : ''}}\n          </div>\n        {% } %}\n      {% }) %}\n      {% if (!instance.options.readOnly && !instance.disabled) { %}\n        <div class=\"col-sm-4\">\n          <div class=\"btn-group pull-right\">\n            <button class=\"btn btn-default btn-light btn-sm editRow\"><i class=\"{{ iconClass('edit') }}\"></i></button>\n            {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}\n              <button class=\"btn btn-danger btn-sm removeRow\"><i class=\"{{ iconClass('trash') }}\"></i></button>\n            {% } %}\n          </div>\n        </div>\n      {% } %}\n    </div>",
                        "tableRow": "\n      {% util.eachComponent(components, function(component) { %}\n          {% if (!component.hasOwnProperty('tableView') || component.tableView) { %}\n            <td class=\"editgrid-table-column\">\n              {{ getView(component, row[component.key]) }}\n            </td>\n          {% } %}\n        {% }) %}\n        {% if (!instance.options.readOnly && !instance.disabled) { %}\n          <td class=\"editgrid-table-column\">\n            <div class=\"btn-group\">\n              <button class=\"btn btn-default btn-light btn-sm editRow\" aria-label=\"{{ t('Edit row') }}\"><i class=\"{{ iconClass('edit') }}\"></i></button>\n              {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}\n              <button class=\"btn btn-danger btn-sm removeRow\" aria-label=\"{{ t('Remove row') }}\"><i class=\"{{ iconClass('trash') }}\"></i></button>\n              {% } %}\n            </div>\n          </td>\n        {% } %}\n    ",
                        "footer": ""
                    },
                    components: [
                        {
                            type: 'columns',
                            label: 'Data',
                            key: 'columns',
                            input: true,
                            inline: true,
                            columns: [


                                {
                                    currentWidth: 4,
                                    width: 4,
                                    components: [
                                        {
                                            type: 'textfield',
                                            label: 'Field Name',
                                            key: 'paramsFieldName',
                                            input: true,
                                            inline: true,
                                            validate: {
                                                required: true
                                            }
                                        },
                                    ]
                                },

                                {
                                    currentWidth: 4,
                                    width: 4,
                                    components: [
                                        {
                                            type: 'textfield',
                                            label: 'Field Value/Local Storage Path',
                                            key: 'paramsFieldPath',
                                            input: true,
                                            inline: true,
                                            validate: {
                                                required: true
                                            }

                                        },
                                    ]
                                },
                                {
                                    currentWidth: 4,
                                    width: 4,
                                    components: [
                                        {
                                            type: 'checkbox',
                                            label: 'Is Local Storage Path',
                                            key: 'isLocalStorage',
                                            input: true,
                                            inline: true,

                                        },
                                    ]
                                }
                            ]
                        },
                    ]
                },
                {
                    type: 'textarea',
                    label: 'Request Body',
                    key: 'requestBody',
                    input: true,
                    inline: true,
                    tooltip: "Wrap the variables you want to set their values later within {var}",
                    hidden: true,
                    logic: [
                        {
                            "name": "hidden",
                            "trigger": {
                                "type": "simple",
                                "simple": {
                                    "show": true,
                                    "when": "requestMethod",
                                    "eq": "POST"
                                }
                            },
                            "actions": [
                                {
                                    "name": "hidden",
                                    "type": "property",
                                    "property": {
                                        "label": "Hidden",
                                        "value": "hidden",
                                        "type": "boolean"
                                    },
                                    "state": false
                                }
                            ]
                        }
                    ],
                    // validate: {
                    //     required: true
                    // }
                },
                {
                    type: 'editgrid',
                    label: 'Request Body Fields',
                    key: 'bodyGrid',
                    hidden: true,
                    logic: [
                        {
                            "name": "hidden",
                            "trigger": {
                                "type": "simple",
                                "simple": {
                                    "show": true,
                                    "when": "requestMethod",
                                    "eq": "POST"
                                }
                            },
                            "actions": [
                                {
                                    "name": "hidden",
                                    "type": "property",
                                    "property": {
                                        "label": "Hidden",
                                        "value": "hidden",
                                        "type": "boolean"
                                    },
                                    "state": false
                                }
                            ]
                        }
                    ],
                    input: true,
                    inline: true,
                    templates: {
                        "header": "<div class=\"row\">\n      {% util.eachComponent(components, function(component) { %}\n        {% if (displayValue(component)) { %}\n          <div class=\"col-sm-4\">{{ t(component.label) }}</div>\n        {% } %}\n      {% }) %}\n    </div>",
                        "tableHeader": "\n      <tr>\n        {% util.eachComponent(components, function(component) { %}\n          {% if (!component.hasOwnProperty('tableView') || component.tableView) { %}\n            <td class=\"editgrid-table-column\">{{ component.label }}</td>\n          {% } %}\n        {% }) %}\n        {% if (!instance.options.readOnly && !instance.disabled) { %}\n          <td class=\"editgrid-table-column\">Actions</td>\n        {% } %}\n      </tr>\n    ",
                        "row": "<div class=\"row\">\n      {% util.eachComponent(components, function(component) { %}\n        {% if (displayValue(component)) { %}\n          <div class=\"col-sm-4\">\n            {{ isVisibleInRow(component) ? getView(component, row[component.key]) : ''}}\n          </div>\n        {% } %}\n      {% }) %}\n      {% if (!instance.options.readOnly && !instance.disabled) { %}\n        <div class=\"col-sm-4\">\n          <div class=\"btn-group pull-right\">\n            <button class=\"btn btn-default btn-light btn-sm editRow\"><i class=\"{{ iconClass('edit') }}\"></i></button>\n            {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}\n              <button class=\"btn btn-danger btn-sm removeRow\"><i class=\"{{ iconClass('trash') }}\"></i></button>\n            {% } %}\n          </div>\n        </div>\n      {% } %}\n    </div>",
                        "tableRow": "\n      {% util.eachComponent(components, function(component) { %}\n          {% if (!component.hasOwnProperty('tableView') || component.tableView) { %}\n            <td class=\"editgrid-table-column\">\n              {{ getView(component, row[component.key]) }}\n            </td>\n          {% } %}\n        {% }) %}\n        {% if (!instance.options.readOnly && !instance.disabled) { %}\n          <td class=\"editgrid-table-column\">\n            <div class=\"btn-group\">\n              <button class=\"btn btn-default btn-light btn-sm editRow\" aria-label=\"{{ t('Edit row') }}\"><i class=\"{{ iconClass('edit') }}\"></i></button>\n              {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}\n              <button class=\"btn btn-danger btn-sm removeRow\" aria-label=\"{{ t('Remove row') }}\"><i class=\"{{ iconClass('trash') }}\"></i></button>\n              {% } %}\n            </div>\n          </td>\n        {% } %}\n    ",
                        "footer": ""
                    },
                    components: [
                        {
                            type: 'columns',
                            label: 'Data',
                            key: 'columns',
                            input: true,
                            inline: true,
                            columns: [


                                {
                                    currentWidth: 4,
                                    width: 4,
                                    components: [
                                        {
                                            type: 'textfield',
                                            label: 'Field Name',
                                            key: 'paramsFieldName',
                                            input: true,
                                            inline: true,
                                            validate: {
                                                required: true
                                            }
                                        },
                                    ]
                                },

                                {
                                    currentWidth: 4,
                                    width: 4,
                                    components: [
                                        {
                                            type: 'textfield',
                                            label: 'Field Local Storage Path',
                                            key: 'paramsFieldPath',
                                            input: true,
                                            inline: true,
                                            validate: {
                                                required: true
                                            }

                                        },
                                    ]
                                },
                                {
                                    currentWidth: 4,
                                    width: 4,
                                    components: [
                                        {
                                            type: 'select',
                                            label: 'Field Type',
                                            key: 'paramsFieldtype',
                                            data: {
                                                values: [{label : "Number" , value: "number"} , {label : "String" , value: "string"}]
                                            },
                                            input: true,
                                            inline: true,
                                            validate: {
                                                required: true
                                            }

                                        },
                                    ]
                                }
                            ]
                        },
                    ]
                },
                {
                    type: 'radio',
                    label: 'Fill Response',
                    key: 'fillResponse',
                    input: true,
                    inline: true,

                    values: [
                        {
                            "label": "Fill Fields",
                            "value": "fillFields",
                            "shortcut": ""
                        },
                        {
                            "label": "Fill Select",
                            "value": "fillSelect",
                            "shortcut": ""
                        }
                    ],

                },
                {
                    type: 'columns',
                    label: 'Fill Select',
                    key: 'responseGridSelect',
                    input: true,
                    hidden: true,
                    inline: true,
                    logic: [
                        {
                            "name": "hidden",
                            "trigger": {
                                "type": "simple",
                                "simple": {
                                    "show": true,
                                    "when": "fillResponse",
                                    "eq": "fillSelect"
                                }
                            },
                            "actions": [
                                {
                                    "name": "hidden",
                                    "type": "property",
                                    "property": {
                                        "label": "Hidden",
                                        "value": "hidden",
                                        "type": "boolean"
                                    },
                                    "state": false
                                }
                            ]
                        }
                    ],

                    columns: [
                        {
                            currentWidth: 4,
                            width: 4,
                            components: [
                                {
                                    type: 'textfield',
                                    label: 'API Key',
                                    key: 'selectApiKey',
                                    input: true,
                                    logic: [
                                        {
                                            "name": "required",
                                            "trigger": {
                                                "type": "simple",
                                                "simple": {
                                                    "show": true,
                                                    "when": "fillResponse",
                                                    "eq": "fillSelect"
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
                            currentWidth: 4,
                            width: 4,
                            components: [
                                {
                                    type: 'textfield',
                                    label: 'Data Path',
                                    key: 'selectDataPath',
                                    input: true,
                                    logic: [
                                        {
                                            "name": "required",
                                            "trigger": {
                                                "type": "simple",
                                                "simple": {
                                                    "show": true,
                                                    "when": "fillResponse",
                                                    "eq": "fillSelect"
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
                            currentWidth: 4,
                            width: 4,
                            components: [
                                {
                                    type: 'textfield',
                                    label: 'Label Path',
                                    key: 'selectLabelPath',
                                    input: true,
                                    logic: [
                                        {
                                            "name": "required",
                                            "trigger": {
                                                "type": "simple",
                                                "simple": {
                                                    "show": true,
                                                    "when": "fillResponse",
                                                    "eq": "fillSelect"
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
                            currentWidth: 4,
                            width: 4,
                            components: [
                                {
                                    type: 'textfield',
                                    label: 'Value Path',
                                    key: 'selectValuePath',
                                    input: true,
                                    logic: [
                                        {
                                            "name": "required",
                                            "trigger": {
                                                "type": "simple",
                                                "simple": {
                                                    "show": true,
                                                    "when": "fillResponse",
                                                    "eq": "fillSelect"
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
                        }
                    ]

                },
                {
                    type: 'editgrid',
                    label: 'Fill Fields',
                    hidden: true,
                    key: 'responseGrid',
                    logic: [
                        {
                            "name": "hidden",
                            "trigger": {
                                "type": "simple",
                                "simple": {
                                    "show": true,
                                    "when": "fillResponse",
                                    "eq": "fillFields"
                                }
                            },
                            "actions": [
                                {
                                    "name": "hidden",
                                    "type": "property",
                                    "property": {
                                        "label": "Hidden",
                                        "value": "hidden",
                                        "type": "boolean"
                                    },
                                    "state": false
                                }
                            ]
                        }
                    ],
                    input: true,
                    inline: true,
                    modal: true,
                    templates: {
                        "header": "<div class=\"row\">\n      {% util.eachComponent(components, function(component) { %}\n        {% if (displayValue(component)) { %}\n          <div class=\"col-sm-4\">{{ t(component.label) }}</div>\n        {% } %}\n      {% }) %}\n    </div>",
                        "tableHeader": "\n      <tr>\n        {% util.eachComponent(components, function(component) { %}\n          {% if (!component.hasOwnProperty('tableView') || component.tableView) { %}\n            <td class=\"editgrid-table-column\">{{ component.label }}</td>\n          {% } %}\n        {% }) %}\n        {% if (!instance.options.readOnly && !instance.disabled) { %}\n          <td class=\"editgrid-table-column\">Actions</td>\n        {% } %}\n      </tr>\n    ",
                        "row": "<div class=\"row\">\n      {% util.eachComponent(components, function(component) { %}\n        {% if (displayValue(component)) { %}\n          <div class=\"col-sm-4\">\n            {{ isVisibleInRow(component) ? getView(component, row[component.key]) : ''}}\n          </div>\n        {% } %}\n      {% }) %}\n      {% if (!instance.options.readOnly && !instance.disabled) { %}\n        <div class=\"col-sm-4\">\n          <div class=\"btn-group pull-right\">\n            <button class=\"btn btn-default btn-light btn-sm editRow\"><i class=\"{{ iconClass('edit') }}\"></i></button>\n            {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}\n              <button class=\"btn btn-danger btn-sm removeRow\"><i class=\"{{ iconClass('trash') }}\"></i></button>\n            {% } %}\n          </div>\n        </div>\n      {% } %}\n    </div>",
                        "tableRow": "\n      {% util.eachComponent(components, function(component) { %}\n          {% if (!component.hasOwnProperty('tableView') || component.tableView) { %}\n            <td class=\"editgrid-table-column\">\n              {{ getView(component, row[component.key]) }}\n            </td>\n          {% } %}\n        {% }) %}\n        {% if (!instance.options.readOnly && !instance.disabled) { %}\n          <td class=\"editgrid-table-column\">\n            <div class=\"btn-group\">\n              <button class=\"btn btn-default btn-light btn-sm editRow\" aria-label=\"{{ t('Edit row') }}\"><i class=\"{{ iconClass('edit') }}\"></i></button>\n              {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}\n              <button class=\"btn btn-danger btn-sm removeRow\" aria-label=\"{{ t('Remove row') }}\"><i class=\"{{ iconClass('trash') }}\"></i></button>\n              {% } %}\n            </div>\n          </td>\n        {% } %}\n    ",
                        "footer": ""
                    },
                    components: [
                        {
                            type: 'columns',
                            label: 'Data',
                            key: 'columns',
                            input: true,
                            inline: true,
                            columns: [


                                {
                                    currentWidth: 4,
                                    width: 4,
                                    components: [
                                        {
                                            type: 'textfield',
                                            label: 'Field Name',
                                            key: 'paramsFieldName',
                                            input: true,
                                            inline: true,
                                            logic: [
                                                {
                                                    "name": "required",
                                                    "trigger": {
                                                        "type": "simple",
                                                        "simple": {
                                                            "show": true,
                                                            "when": "fillResponse",
                                                            "eq": "fillFields"
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
                                    currentWidth: 4,
                                    width: 4,
                                    components: [
                                        {
                                            type: 'textfield',
                                            label: 'Field Path',
                                            key: 'paramsFieldPath',
                                            input: true,
                                            inline: true,
                                            logic: [
                                                {
                                                    "name": "required",
                                                    "trigger": {
                                                        "type": "simple",
                                                        "simple": {
                                                            "show": true,
                                                            "when": "fillResponse",
                                                            "eq": "fillFields"
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
                                    currentWidth: 4,
                                    width: 4,
                                    components: [
                                        {
                                            type: 'textfield',
                                            label: 'Field API Key',
                                            key: 'fieldApiKey',
                                            input: true,
                                            inline: true,
                                            logic: [
                                                {
                                                    "name": "required",
                                                    "trigger": {
                                                        "type": "simple",
                                                        "simple": {
                                                            "show": true,
                                                            "when": "fillResponse",
                                                            "eq": "fillFields"
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
                                }
                            ]
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
