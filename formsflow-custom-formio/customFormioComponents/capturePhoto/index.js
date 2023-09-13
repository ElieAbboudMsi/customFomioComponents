import React, { Component, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ReactComponent, Utils } from "@formio/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as FiIcons from "react-icons/fi";
import { useTranslation } from "react-i18next";
import settingsForm from "./capturePhoto.settingsForm";
import { Modal } from "react-bootstrap";
import Flex from "components/common/Flex";
import moment from "moment";
import { createRoot } from "react-dom/client";

/**
 * An example React component
 *
 * Replace this with your custom react component. It needs to have two things.
 * 1. The value should be stored is state as "value"
 * 2. When the value changes, call props.onChange(null, newValue);
 *
 * This component is very simple. When clicked, it will set its value to "Changed".
 */

const PhotoCapture = ({ ...props }) => {
    function checkURLchange() {
        if (window.location.href != oldURL) {
            window.location.reload();
            // oldState = {};
            oldURL = window.location.href;
        }
    }

    var oldURL = window.location.href;
    const imageRenderedRef = useRef();
    setInterval(checkURLchange, 100);
    const [t, i18n] = useTranslation();
    const errorRef = useRef();
    const imageRef = React.createRef();
    const [state, setState] = useState({
        imageRef: props.value || "",
        facingMode: "user",
        isBack: false,
        startCamera: false,
        targetWidth: 640,
        quality: 0.1,

    })


    const getVideo = async () => {
        if (imageRef.current) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: props.oldState["facingMode"] } }).then((stream) => {
                imageRef.current.srcObject = stream;
                props.setOldState("imageRef", stream);
                props.setOldState("startCamera", true);


            }).catch((e) => {
                console.log(e)
                errorRef.current.innerText = t("Camera Permission is required")

            })
        }




    }
    const flipCamera = async () => {
        let oldStream = props.oldState.imageRef;

        props.oldState.imageRef.getTracks().forEach(function (track) {
            track.stop();
        });
        navigator.mediaDevices.getUserMedia({ video: { facingMode: props.oldState["facingMode"] } }).then((stream) => {
            const prevTrack = oldStream.getVideoTracks()[0];

            var newTrack = stream.getVideoTracks()[0];
            oldStream.removeTrack(prevTrack);

            oldStream.addTrack(newTrack);
            props.setOldState("newStream", stream);

            props.setOldState("imageRef", oldStream);

        })


    }

    const stopCamera = () => {
        props.setOldState("showModal", false);
        if (props.oldState.startCamera === true) {
            props.oldState.imageRef.getTracks().forEach(function (track) {
                track.stop();
            });
            props.setOldState("startCamera", false);

        }



        props.setOldState("mouseCoordinates", { x: -1, y: -1 });
        props.setOldState("coordinates", { x: -1, y: -1 });
        props.setOldState("datetime", "");





    }

    useEffect(() => {
        const handlePopState = () => {
            // This function will be called when the popstate event occurs
            window.location.reload();
            // oldState = {};

            // You can perform any actions here based on the popstate event
        };

       
        if (props.component.defaultValue && props.component.defaultValue !== "") {
            let details = {};
            if (props.component.defaultValue.imageRef) {
                details = props.component.defaultValue;
            }
            else {
                details = JSON.parse(props.component.defaultValue);

            }
            props.setOldState("imageRef", details.imageRef);
            props.setOldState("datetime", details.datetime);
            props.setOldState("coordinates", details.coordinates);


        }

        // Add the event listener when the component mounts
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);

        }




    }, [])
    
    const getLocationCoordinates = async () => {
       
        if (navigator.geolocation && props.oldState.coordinates.latitude === -1) {
            const options = {
                enableHighAccuracy: false,
                maximumAge: Infinity

            };

            function success(pos) {
                const crd = pos.coords;
                console.log(crd)
                props.setOldState("coordinates", { latitude: crd.latitude, longitude: crd.longitude });
                navigator.geolocation.clearWatch(id);
                props.onChange({ imageRef: props.oldState.imageRef, datetime: props.oldState.datetime, coordinates: { latitude: crd.latitude, longitude: crd.longitude } }, null);

            }

            function error(err) {
                console.warn(`ERROR(${err.code}): ${err.message}`);
            }

         let id = navigator.geolocation.watchPosition(success, error, options);

        }

    }
    const capturePhotoFunction = async (imageRef) => {
        if (!props.oldState["imageRef"].toString().startsWith("data")) {
            props.setOldState("showModal", false);
            const canvas = document.createElement("canvas");
            const scaleFactor = props.oldState["targetWidth"] / imageRef.videoWidth;

            canvas.width = props.oldState["targetWidth"];
            canvas.height = imageRef.videoHeight * scaleFactor;
            canvas.getContext("2d").drawImage(imageRef, 0, 0);
            const imageDataURL = canvas.toDataURL("image/jpeg", props.oldState["quality"]); // Lower quality
            props.oldState.imageRef.getTracks().forEach(function (track) {
                track.stop();
            });



            props.setOldState("imageRef", imageDataURL);

            props.setOldState("startCamera", false);
            props.setOldState("datetime", moment().format("DD-MM-YYYY hh:mm a"));



            props.onChange({ imageRef: imageDataURL, datetime: moment().format("DD-MM-YYYY hh:mm a"), coordinates: props.oldState.coordinates }, null);


        }
        else {


            let stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: props.oldState["facingMode"] } })
            imageRef.srcObject = stream;
            props.setOldState("imageRef", stream);
            props.setOldState("startCamera", true);
         
            props.setOldState("datetime", "");


            props.onChange("", null);


        }
    }
    const takePhoto = async () => {
        getLocationCoordinates();
        capturePhotoFunction(imageRef.current);

    };



    // const redrawImage = () => {
    //     if(imageRef.current){
    //         const canvas = document.createElement("canvas");
    //         const ctx = canvas.getContext("2d");

    //         const scaleFactor = state.targetWidth / imageRef.current.videoWidth;
    //         canvas.width = state.targetWidth;
    //         canvas.height = imageRef.current.videoHeight * scaleFactor;

    //         ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    //         const imageDataURL = canvas.toDataURL("image/jpeg", state.quality); // Lower quality
    //         oldState[props.component.key]["imageRef"] = imageDataURL;
    //         props.onChange(imageDataURL, null);
    //         updateState({ ...oldState })
    //     }


    // };


    // useEffect(() => {
    //     if (state.imageRef.toString().startsWith("data") && props.component.defaultValue === null) {

    //         redrawImage();
    //     }
    // }, [state.targetWidth, state.quality]);

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

    const myModal = <Modal show={props.oldState.showModal} onHide={() => {
        props.setOldState("showModal", false);
        if (props.oldState.startCamera === true) {
            props.oldState.imageRef.getTracks().forEach(function (track) {
                track.stop();
            });
            props.setOldState("startCamera", false);

        }

    }} fullscreen={true}>
        <Modal.Header
            closeButton
            className="border-200">
            <Modal.Title as="h5">
                <Flex alignItems="center">

                    <div className="ms-2">
                        {t("Capture Photo")}
                    </div>
                </Flex>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {
                props.component.disabled !== true && <div style={{ position: "relative", width: "100%", height: "100%", display: props.oldState["startCamera"] ? "block" : "none" }}>
                    <div title={"Camera Mode"} style={{ position: "absolute", right: 0, top: 0, cursor: "pointer", zIndex: 5 }} onClick={() => {
                        props.setOldState("facingMode", props.oldState["facingMode"] === "user" ? "environment" : "user");


                        flipCamera();
                    }} >
                        <FontAwesomeIcon icon={"rotate"} />


                    </div>
                    <video autoPlay={true}
                        playsInline={true}
                        muted={true} width={"100%"} height={"100%"} style={{ objectFit: "fill" }} ref={imageRef} />
                </div>
            }
            {props.oldState["imageRef"].toString().startsWith("data") && <img width={"100%"} height={"100%"} style={{ objectFit: "fill" }} src={props.oldState["imageRef"]} />}

        </Modal.Body>
        <Modal.Footer>
            {
                props.component.disabled !== true && <div className="d-flex w-100 justify-content-between">
                    <div></div>
                    {
                        props.component.disabled !== true ?
                            (!props.oldState["imageRef"].toString().startsWith("data") && props.oldState["startCamera"]) ?
                                <button className="btn btn-primary btn-wizard-nav-submit" title={t("Take Photo")} style={{ marginTop: "10px" }} onClick={() => takePhoto()}>  <FiIcons.FiCamera /></button> : props.oldState["imageRef"].toString().startsWith("data") ? <button className="btn btn-primary btn-wizard-nav-submit" style={{ marginTop: "10px" }} title={t("Retake Photo")} onClick={() => takePhoto()}>  <FiIcons.FiCamera /></button> : <></> : <></>
                    }
                    {(!props.oldState["startCamera"] && !props.oldState["imageRef"].toString().startsWith("data")) ? <button title={t("Start Camera")} className="btn btn-primary btn-wizard-nav-submit" onClick={() => getVideo()} style={{ marginTop: "10px" }}><FiIcons.FiCamera /> </button> :
                        !props.oldState["imageRef"].toString().startsWith("data") ? <button onClick={() => {
                            stopCamera();




                        }} style={{ marginTop: "10px" }} title="Stop Camera" className="btn btn-danger btn-wizard-nav-submit"><FiIcons.FiCameraOff /></button> : <></>
                    }

                </div>
            }
            <div ref={errorRef} id="photo-error"></div>


        </Modal.Footer>
    </Modal>

    useEffect(() => {



        if (!props.oldState["imageRef"].toString().startsWith("data")) {
            if (props.oldState["startCamera"] === false) {
                if (props.oldState["showModal"] === true) {
                    getVideo();

                }
            }


        }
    }, [props.oldState["startCamera"], props.oldState["imageRef"], props.oldState["showModal"]])
    console.log(props.form._data)

    return (
        <div>
            {myModal}
            {
                props.component.disabled !== true && <button title={t("Capture Photo")} className="btn btn-primary btn-wizard-nav-submit" onClick={() => {
                    props.setOldState("showModal", true);
                }} style={{ marginTop: "10px" }}><FiIcons.FiCamera /> </button>}
            <div style={{ position: "relative" }}>
                {
                    props.oldState["imageRef"].toString().startsWith("data") ? <ul style={{ backgroundColor: "black", position: "absolute", top: "5px", left: "5px", color: "#fff" }}>
                        <li>{props.oldState.datetime}</li>
                        {props.oldState.coordinates.longitude !== -1 && <li>{(props.oldState.coordinates.longitude + "," + props.oldState.coordinates.latitude)}</li>}


                    </ul> : <></>
                }
                {props.oldState["imageRef"].toString().startsWith("data") && <img width={"100%"} height={"500px"} style={{ objectFit: "cover", marginTop: "5px" }} src={props.oldState["imageRef"]} />}

            </div>


            {/* {
                state.imageRef.toString().startsWith("data") && props.component.defaultValue === null && <div>
                    <div className="d-flex align-items-center flex-wrap mt-3">
                        <div className="d-flex align-items-center">
                            <label>Target Width</label>
                            <input type="number" className="mx-2" value={state.targetWidth} onChange={(e) => {
                                oldState[props.component.key]["targetWidth"] = e.target.value;
                                updateState({ ...oldState });


                            }} />
                        </div>

                        <div className="d-flex align-items-center ">
                            <label>Quality</label>
                            <input className="mx-2" type="range" min="0.1"
                                max="1"
                                step="0.01" value={state.quality} onChange={(e) => {
                                    oldState[props.component.key]["quality"] = parseFloat(e.target.value)
                                    updateState({ ...oldState });


                                }} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <label>
                            Size: {(stringToBytesFaster(state.imageRef.toString()).length) / 1000000}MB --- {(stringToBytesFaster(state.imageRef.toString()).length) / 1000}KB </label>
                    </div>
                </div>
            } */}
            {

            }


        </div>
    );
};

export default class Photo extends ReactComponent {
    static shouldSetValue = false; // Define shouldSetValue as a static property

    /**
   * This is the first phase of component building where the component is instantiated.
   *
   * @param component - The component definition created from the settings form.
   * @param options - Any options passed into the renderer.
   * @param data - The submission data where this component's data exists.
   */
    constructor(component, options, data) {
        options["oldState"] = {
            targetWidth: 640,
            quality: 0.1,
            imageRef: "",
            facingMode: "environment",
            isBack: false,
            startCamera: false,
            newStream: "",
            showModal: false,
            datetime: "",
            coordinates: { latitude: -1, longitude: -1 },
            showDetails: false,

        }
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
            type: "photoCapture",
            label: ""
        });
    }
    static get builderInfo() {
        return {
            title: "PhotoCapture",
            icon: "cubes",
            group: "Basic",
            documentation: "",
            weight: -10,
            schema: Photo.schema()
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
        const root = createRoot(element);

        let gridComponent = null;
        const rootForm = this.getRoot(); // Get the root form object
        let insideGrid = false;
        let key = this.component.key
        Utils.eachComponent(rootForm.components, function (component) {

            if (component.component.type === "editgrid") {
                gridComponent = component;

                Utils.eachComponent(component.component.components, function (component2) {
                    if (!insideGrid) {
                        insideGrid = component2.key === key

                    }


                }, true)
            }

        }, true)
        const setOldState = (key, value) => {

            this.options["oldState"][key] = value;
            this.updateOnChange({}, true);
             root.render(
                <PhotoCapture
                    component={this.component} // These are the component settings if you want to use them to render the component.
                    onChange={this.updateValue} // Pass the onChange event handler
                    value={this.dataValue}
                    data={this.data}
                    form={rootForm}
                    insideGrid={insideGrid}
                    setOldState={setOldState}
                    oldState={this.options["oldState"]}

                />,
                element
            );

        }

        root.render(
            <PhotoCapture
                component={this.component} // These are the component settings if you want to use them to render the component.
                onChange={this.updateValue} // Pass the onChange event handler
                value={this.dataValue}
                data={this.data}
                form={rootForm}
                insideGrid={insideGrid}
                setOldState={setOldState}
                oldState={this.options["oldState"]}

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
