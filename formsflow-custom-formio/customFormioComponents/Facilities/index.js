import React, { Component } from "react";
import ReactDOM from "react-dom";
import { ReactComponent } from "@formio/react";
import settingsForm from "./Facilities.settingsForm";
import CustomSelect from "../customSelect";
import _ from 'lodash';


const FacilitiesCustomComp = class extends Component {

    constructor(props) {
        let newProps = { ...props }
        super(newProps);
        this.state = {
            options: [],
            value: this.props.value || "",
            requestUrl: "",
            oldURL : window.location.href
        };
        this.onPopstate = this.onPopstate.bind(this)


    }
  
    onPopstate() {
        window.location.reload();

    }
    // Update the setValue method to handle onChange event
    updateValue = (e) => {
        if (this.props.form._form.components[0]?.toEdit !== true) {

            const newValue = e.target.value; // Get the selected value from the event
            this.setState(
                { value: newValue },
                () => {
                    props.data[props.component.key] = newValue;


                    // console.log("Updated value:", newValue); // Add this line to log the updated value

                }
            );
        }
    };
    shouldComponentUpdate(nextProps) {
        // console.log("new", nextProps)

        return true;

    }

    //ON LOAD
    async componentDidMount() {

        window.addEventListener("popstate", this.onPopstate);

        if (this.props.component.requestUrl !== "" && this.props.component.requestUrl) {
            this.setState({ requestUrl: this.props.component.requestUrl })

            let accessToken = localStorage.getItem("accessToken");

            let refreshToken = localStorage.getItem("refreshToken");


            fetch(this.props.component.requestUrl, { method: "GET", headers: { "Content-Type": "application/json", "AccessToken": accessToken, "RefreshToken": refreshToken } }).then(response => response.json()).then((res) => {
                if (res) {
                    let path = this.props.component.dataPath;
                    let result = path ? _.get(res, path, '') : res;

                    let val = result?.map(e => ({ label: e.entityName, value: e.organizationEmail, ...e }));
                    this.setState({ options: val });
                    if (this.props.form._form.components[0]?.toEdit !== true) {
                        this.props.component.values = val;

                    }
                    this.props.component.loaded = true;
                }

            }).then(() => {

            }).catch(error => { console.error("Error:", error); });
        }
        else {
            if (this.props.component.values && Object.keys(this.props.component.values).length !== 0) {
                this.setState({ options: this.props.component.values });

            }
        }
    }

    // Add componentWillUnmount method
    componentWillUnmount() {
        window.removeEventListener("popstate", this.onPopstate, false);


    }

    render() {
        const { options, value } = this.state;
        return (
            <CustomSelect component={this.props.component} disabled={this.props.component.disabled && this.props.component.disabled === true} value={value} options={options} updateValue={this.updateValue} />

            // <select className="form-control custom-dropdown" disabled={this.props.component.disabled && this.props.component.disabled === true} value={value} onChange={this.updateValue}>
            //     <option disabled value="">Select option</option>

            //     {
            //         options?.map((option) => {
            //             return <option value={option.value}>
            //                 {option.label}
            //             </option>
            //         })
            //     }
            // </select>
        );
    }
};

export default class Facilities extends ReactComponent {
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
            type: "facilitiesCustomComp",
            label: "",

        });
    }
    static get builderInfo() {
        return {
            title: "Facilities",
            icon: "cubes",
            group: "Basic",
            documentation: "",
            weight: -10,
            schema: Facilities.schema()
        };
    }
    static editForm = settingsForm;

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

        return ReactDOM.render(
            <FacilitiesCustomComp
                component={this.component} // These are the component settings if you want to use them to render the component.
                onChange={this.updateValue} // Pass the onChange event handler
                value={this.dataValue}
                form={rootForm}
                data = {this.data}
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
        return true;
    }



}
