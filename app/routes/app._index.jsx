import React from 'react'
import { Card, Page, TextField, Button } from "@shopify/polaris";
import { useState,useEffect } from "react";
import { useLoaderData, Form } from "@remix-run/react";
import { useNavigate } from '@remix-run/react';

 const Register = () => {
   
const [isLoading, setisLoading] = useState(true)
const [error, setError] = useState("")
const [formData,setFormData] = useState({
  shopEmail : '',
  customerEmail:''
})
const navigate = useNavigate()

  useEffect(() => {
    const logindata = async () => {
      try {
        const res = await fetch("/api/user");
        // console.log("errrorrrr",res.message)
        if (!res.ok) {
          console.error("Error:", res.statusText);
          return;
        }
        const data = await res.json();
        if (data.message == "customer email is found") {
          navigate("/app/chatbox")
        } else {
          setisLoading(false)
          setFormData({...formData,shopEmail:data.shopEmail})
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    
    logindata()
  }, [])
  const handleSubmit = async () => {
     if (!formData.customerEmail) {
      setError("Email is Required")
     }
      else{
        try {
          setisLoading(true)
          const res = await fetch(`/api/user`, {
            method: "POST",
            body:  JSON.stringify(formData)
          });
          const data = await res.json();
          if (data.message == "customer email is found") {
            navigate("/app/chatbox")
          } else {
            setError(data.message);
          }
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
  };

  if (isLoading) {
    return(
      <h2>Loading...</h2> 
    )
  }
  else  {
    return (
      <Page title="Register">
      <Card sectioned>
        <Form method="post" >
          <TextField
            label="Enter your email"
            value={formData.customerEmail}
            onChange={(value)=>setFormData({...formData,customerEmail:value})}
            name="email"
            type="email"
          />
          {error && <p style={{color:"red"}}>{error}</p>}
          <Button  primary onClick={handleSubmit}>
            submit
          </Button>
        </Form>
      </Card>
     
    </Page>
    )
  }
 
}

export default Register

