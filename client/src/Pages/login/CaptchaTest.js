import React, { Component } from "react";

import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha
} from "react-simple-captcha";

class CaptchaTest extends Component {
  componentDidMount() {
    loadCaptchaEnginge(8);
  }

  doSubmit = () => {
    let user_captcha = document.getElementById("user_captcha_input").value;

    if (validateCaptcha(user_captcha) === true) {
      alert("Captcha Matched");
      loadCaptchaEnginge(6);
      document.getElementById("user_captcha_input").value = "";
    } else {
      alert("Captcha Does Not Match");
      document.getElementById("user_captcha_input").value = "";
    }
  };

  render() {
    return (
      <div>
        <div>
          <div>
            <div>
              <LoadCanvasTemplate />
            </div>

            <div>
              <div>
                <input
                  placeholder="Enter Captcha"
                  // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-black"
                  id="user_captcha_input"
                  name="user_captcha_input"
                  type="text"
                ></input>
              </div>
            </div>

            <div>
              <div>
                <button
                  onClick={() => this.doSubmit()}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CaptchaTest;
