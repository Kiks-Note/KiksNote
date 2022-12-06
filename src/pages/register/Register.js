import './Register.scss';
import { useForm } from "react-hook-form";

function Register() {
    const {handleSubmit} = useForm();
    const onSubmit = (data, r) => {
        alert(`Thank you for your message from`);
        const templateId = 'ConfirmMail';
        const serviceID = 'ConfirmKiks';
        sendConfirm(serviceID, templateId, { from_name: "Kik's Note Confirmation", message_html: "https://www.youtube.com/watch?v=RN1eftSE9xU", reply_to: "davidroquain03@gmail.com" })
        r.target.reset();
    }
    const sendConfirm = (serviceID, templateId, variables) => {
        window.emailjs.send(
            serviceID, templateId,
            variables
        ).then(res => {
            console.log('Email successfully sent!')
        })
            .catch(err => console.error('There has been an error.  Here some thoughts on the error that occured:', err))
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="submit" />
        </form>
    );
}

export default Register;