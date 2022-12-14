import React from 'react'
import "./Popup.css";
import Button from "@mui/material/Button";
import { Translator, Translate } from 'react-auto-translate';

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

/**
 * @author Anthony Mercado
 * Creates a popup window to prompt the user with.
 * @constructor
 */
function Popup(props) {
    const dark = props.dark;
    return (props.trigger) ? (
        <Translator
            from='en'
            to={props.lang}
            googleApiKey={apiKey}
        >
            <div className="popup">
                <div className={dark === 'dark' ? "popup-inner-dark" : "popup-inner"}>
                    <Button
                        variant="contained"
                        color="error"
                        className="close-btn"
                        onClick={() => props.setTrigger(false)}
                    ><Translate>Cancel</Translate></Button>
                    {props.children}
                </div>
            </div>
        </Translator>
    ) : "";
}

export default Popup