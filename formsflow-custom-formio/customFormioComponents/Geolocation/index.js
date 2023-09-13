import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ReactComponent, Utils } from "@formio/react";

let oldState = {

};
const GeolocationComponent = ({ ...props }) => {
    function checkURLchange() {
        if (window.location.href != oldURL) {
            oldState = {};
            oldURL = window.location.href;
        }
    }

    var oldURL = window.location.href;
    setInterval(checkURLchange, 200);
    const [state, setState] = useState({
        longitude: -1,
        latitude: -1
    });




    const updateState = async (json) => {



        setState({ ...json[props.form._form._id][props.component.key] });
    }

    useEffect(() => {
        if (!oldState[props.form._form._id]) {
            oldState[props.form._form._id] = {};
        }
        if (!oldState[props.form._form._id][props.component.key]) {
            oldState[props.form._form._id][props.component.key] = {

                longitude: "",
                latitude: ""
            }

        }
        const handlePopState = () => {
            // This function will be called when the popstate event occurs
            oldState = {};

            // You can perform any actions here based on the popstate event
        };
        if (props.component.defaultValue && props.component.defaultValue !== "") {
            let details = {};
            if (props.component.defaultValue.latitude) {
                details = props.component.defaultValue;
            }
            else {
                details = JSON.parse(props.component.defaultValue);

            }
            oldState[props.form._form._id][props.component.key]["latitude"] = details.latitude;
            oldState[props.form._form._id][props.component.key]["longitude"] = details.longitude;
            updateState({ ...oldState })

        }
        else if (oldState[props.form._form._id][props.component.key]["latitude"] !== "") {

            updateState({ ...oldState })
            if (props.form._form.components[0]?.toEdit !== true) {

                props.data[props.component.key] = { latitude: oldState[props.form._form._id][props.component.key]["latitude"], longitude: oldState[props.form._form._id][props.component.key]["longitude"] };

            }
        }
        else if (navigator.geolocation) {

            navigator.geolocation.watchPosition((position) => {
                oldState[props.form._form._id][props.component.key]["latitude"] = position.coords.latitude;
                oldState[props.form._form._id][props.component.key]["longitude"] = position.coords.longitude;
                updateState({ ...oldState })
                if (props.form._form.components[0]?.toEdit !== true) {

                    props.data[props.component.key] = { latitude: position.coords.latitude, longitude: position.coords.longitude };

                }

            });


        }

        // Add the event listener when the component mounts
        window.addEventListener('popstate', handlePopState);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };

    }, [])

    useEffect(() => {
        let keys = Object.keys(props.data);
        for (let i = 0; i < keys.length; i++) {
            props.form._data[keys[i]] = props.data[keys[i]];
            props.form._submission.data[keys[i]] = props.data[keys[i]];


        }
        if (props.insideGrid === true) {
            delete props.form._data[props.component.key]
            delete props.form._submission.data[props.component.key]

        }


    }, [props.data])


    return (
        <div className="row">
            <div className="col-sm-6">
                <label>Longitude</label>
                <input type="text" className="form-control" value={state.longitude} disabled={true} />

            </div>
            <div className="col-sm-6">
                <label>Latitude</label>
                <input type="text" className="form-control" value={state.latitude} disabled={true} />

            </div>
        </div>
    );
};

export default class Geolocation extends ReactComponent {
    static shouldSetValue = false; // Define shouldSetValue as a static property

    /**
   * This is the first phase of component building where the component is instantiated.
   *
   * @param component - The component definition created from the settings form.
   * @param options - Any options passed into the renderer.
   * @param data - The submission data where this component's data exists.
   */
    constructor(component, options, data) {
        super(component, options, data);
        this.reactInstance = null;

    }

    /**
   * This function is the default settings for the component. At a minimum you want to set the type to the registered
   * type of your component (i.e. when you call Components.setComponent('type', MyComponent) these types should match.
   *
   * @param sources
   * @returns {*}
   */
    static schema(...extend) {
        return ReactComponent.schema({
            type: "geolocation",
            label: "",

        });
    }
    static get builderInfo() {
        return {
            title: "Geolocation",
            icon: "cubes",
            group: "Basic",
            documentation: "",
            weight: -10,
            schema: Geolocation.schema()
        };
    }

    /**
     * This method is called any time the component needs to be rebuilt. It is most frequently used to listen to other
     * components using the this.on() function.
     */
    init() {
        return super.init();
    }

    /**
     * This method is called before the component is going to be destroyed, which is when the component instance is
     * destroyed. This is different from detach which is when the component instance still exists but the dom instance is
     * removed.
     */
    destroy() {
        return super.destroy();
    }
    /**
     * This method is called before a form is submitted.
     * It is used to perform any necessary actions or checks before the form data is sent.
     *
     */

    beforeSubmit() {
        return super.beforeSubmit();
    }

    /**
     * The second phase of component building where the component is rendered as an HTML string.
     *
     * @returns {string} - The return is the full string of the component
     */
    render() {
        // For react components, we simply render as a div which will become the react instance.
        // By calling super.render(string) it will wrap the component with the needed wrappers to make it a full component.
        return super.render(`<div ref="react-${this.id}"></div>`);
    }

    /**
     * Callback ref to store a reference to the node.
     *
     * @param element - the node
     */
    setReactInstance(element) {
        this.reactInstance = element;
    }

    /**
     * The third phase of component building where the component has been attached to the DOM as 'element' and is ready
     * to have its javascript events attached.
     *
     * @param element
     * @returns {Promise<void>} - Return a promise that resolves when the attach is complete.
     */
    attach(element) {
        super.attach(element);

        // The loadRefs function will find all dom elements that have the "ref" setting that match the object property.
        // It can load a single element or multiple elements with the same ref.
        this.loadRefs(element, {
            [`react-${this.id}`]: 'single',
        });

        if (this.refs[`react-${this.id}`]) {
            this.attachReact(this.refs[`react-${this.id}`], this.setReactInstance.bind(this));
            if (this.shouldSetValue) {
                this.setValue(this.dataForSetting);
                this.updateValue(this.dataForSetting);
            }
        }
        return Promise.resolve();
    }

    /**
     * The fourth phase of component building where the component is being removed from the page. This could be a redraw
     * or it is being removed from the form.
     */
    detach() {
        if (this.refs[`react-${this.id}`]) {
            this.detachReact(this.refs[`react-${this.id}`]);
        }
        super.detach();
    }

    /**
     * Override this function to insert your custom component.
     *
     * @param element
     * @param ref - callback ref
     */
    attachReact(element, ref) {
        const rootForm = this.getRoot(); // Get the root form object
        let insideGrid = false;
        let key = this.component.key

        Utils.eachComponent(rootForm._form.components, function (component) {
            if (component.type === "editgrid") {
                Utils.eachComponent(component.components, function (component2) {
                    insideGrid = component2.key === key


                })
            }

        })
        return ReactDOM.render(
            <GeolocationComponent
                component={this.component} // These are the component settings if you want to use them to render the component.
                onChange={this.updateValue} // Pass the onChange event handler
                value={this.dataValue}
                data={this.data}
                form={rootForm}
                insideGrid={insideGrid}

            />,
            element
        );
    }

    /**
     * Override this function.
     */
    detachReact(element) {
        return;
    }

    /**
     * Something external has set a value and our component needs to be updated to reflect that. For example, loading a submission.
     *
     * @param value
     */
    setValue(value) {
        if (this.reactInstance) {
            this.reactInstance.setState({
                value: value
            });
            this.shouldSetValue = false;
        }
        else {
            this.shouldSetValue = true;
            this.dataForSetting = value;
        }
    }

    /**
     * The user has changed the value in the component and the value needs to be updated on the main submission object and other components notified of a change event.
     *
     * @param value
     */
    updateValue = (value, flags) => {
        flags = flags || {};
        const newValue = value === undefined || value === null ? this.getValue() : value;
        const changed = (newValue !== undefined) ? this.hasChanged(newValue, this.dataValue) : false;
        console.log("new", newValue)
        this.dataValue = Array.isArray(newValue) ? [...newValue] : newValue;

        this.updateOnChange(flags, changed);
        return changed;
    }

    /**
     * Get the current value of the component. Should return the value set in the react component.
     *
     * @returns {*}
     */
    getValue() {
        if (this.reactInstance) {
            return this.reactInstance.state.value;
        }
        return this.defaultValue;
    }

    /**
     * Override normal validation check to insert custom validation in react component.
     *
     * @param data
     * @param dirty
     * @param rowData
     * @returns {boolean}
     */
    checkValidity(data, dirty, rowData) {
        const valid = super.checkValidity(data, dirty, rowData);
        if (!valid) {
            return false;
        }
        return this.validate(data, dirty, rowData);
    }

    /**
     * Do custom validation.
     *
     * @param data
     * @param dirty
     * @param rowData
     * @returns {boolean}
     */
    validate(data, dirty, rowData) {
        // console.log("data" , data)
        // if(!data.photoCapture){
        //     return false;

        // }
        // if(!data.photoCapture.toString().startsWith("data")){
        //     return false;
        // }
        return true;
    }



}
