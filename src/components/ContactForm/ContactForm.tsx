import React, { useEffect, useState } from 'react'
import { ContactFormWrapper } from './ContactForm.styles'
import { Form, Input, Button, Space, Modal } from 'antd';
import db from '../../firebase';
import 'antd/dist/antd.css';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const MOBILE_REGEX = /^([0-9]!*){10,}$/;

export const ContactForm = () => {
    const [showModal, setShowModal] = useState(false);

    //will hold the total counts
    const [jammaathOneCount, setJamaathOneCount] = useState<number>(0);

    const [idNum, setIdNum] = useState<string>("");
    const [email, SetEmail] = useState<string>("");
    const [mobileNum, setMobileNum] = useState<number>(0);
    const [fullName, SetFullName] = useState<string>("");
    const [form] = Form.useForm();

    useEffect(() => {
        //refetch counts
        db.collection("Counts")?.onSnapshot((snapshot : any) => {
            if (snapshot.docs.length > 0) {
                setJamaathOneCount(snapshot.docs[0]?.data()['counts']);
            }
        })
    }, [jammaathOneCount])

    const formSubmission = async (event:any) => {
        setShowModal(false);

        db.collection("Registered")
        .add({
            idNum,
            email,
            fullName,
            mobileNum,
            time: new Date().toUTCString()
        })

        //jamaath counts stored in firebase
        //delete all records and reupdate values
        db.collection("Counts")
            .get()
            .then((res : any) => res.forEach((element : any) => element.ref.delete()))

        db.collection("Counts")
        .add({
            "counts": jammaathOneCount + 1,
        })

        form.resetFields();
        setIdNum("");
        SetEmail("");
        setMobileNum(0);
        SetFullName("");
    }

    const onIdChange = (event: React.ChangeEvent<HTMLInputElement>) => setIdNum(event.currentTarget.value)
    const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => SetEmail(event.currentTarget.value)
    const onMobilNumChange = (event: React.ChangeEvent<HTMLInputElement>) => setMobileNum(parseInt(event.currentTarget.value))
    const onFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => SetFullName(event.currentTarget.value)

    return (
        <ContactFormWrapper>
            <Form onFinish={() => setShowModal(true)} requiredMark={false} colon={false} form={form}>
                <h1>Ladies Rajab Registration</h1>
                <Space />
                <Form.Item
                    label="NIC/Passport Number"
                    name="idNum"
                    rules={[{ required: true, message: "Please input your ID Number" }]}
                >
                    <Input allowClear value={idNum} onChange={onIdChange} />
                </Form.Item>
                <Form.Item
                    label="E-mail"
                    name="email"
                    rules={
                        [{ required: true, message: "Please input your email" }, 
                        {pattern: EMAIL_REGEX, message: "Please enter a valid E-mail" }
                    ]}
                >
                    <Input allowClear value={email} onChange={onEmailChange} />
                </Form.Item>
                <Form.Item
                    label="Mobile Number"
                    name="mobileNum"
                    rules={
                        [{ required: true, message: "Please input your Mobile Number"}, 
                        {pattern: MOBILE_REGEX, message: "Please enter a valid Mobile Number" }
                    ]}
                >
                    <Input allowClear value={mobileNum} onChange={onMobilNumChange} />
                </Form.Item>
                <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: "Please input your Full Name"}]}
                >
                    <Input allowClear value={fullName} onChange={onFullNameChange} />
                </Form.Item>
                <Form.Item>
                    <div className="contactUs__formBtn">
                        {(jammaathOneCount === 50) ||
                            (!idNum || !email || !mobileNum || !fullName)
                            ? (
                            <Button disabled style={{ width: '100%' }} htmlType="submit" type="primary">CONFIRM</Button>
                        ) : (
                            <Button style={{ width: '100%' }} htmlType="submit" type="primary">CONFIRM</Button>
                        )}
                    </div>
                </Form.Item>
            </Form>
            <Modal centered visible={showModal}  title="Your response has been recorded" onOk={formSubmission} onCancel={formSubmission}>
                <p>Assalamu Alaikum {fullName}, your response has been recorded</p>
            </Modal>
        </ContactFormWrapper>
    )
}
