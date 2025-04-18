import React from 'react';
import './css/ContactUs.css';
// import { EmailRounded, Facebook, FacebookSharp, Instagram, LinkedIn, LocationCity, LocationOn, Map, Phone, PhoneAndroid, Twitter } from '@mui/icons-material';
import { MailIcon, MapPin, PhoneCallIcon } from 'lucide-react';

const ContactUsPage = () => {
  return (
      <div class="w-full h-full flex justify-center items-center !bg-backgroundv2 !py-8 !z-0 px-2">
        <div class="contact-form w-full max-w-[1000px] !bg-backgroundv2 ">
            <div class="contact-info">
                <h1 class="title !text-textPrimary">Let's get in touch ... </h1>
                <p class="text !text-textPrimary">
                    NewUnity: Where Community Thrives - Stay Connected, Engaged, and Informed!
                     individuals converge to forge stronger bonds and ignite positive change within our
                    communities. <br /> <br />
                    we believe in
                    the power of collective action to overcome challenges, inspire innovation,
                    and create a world where everyone thrives. <br /><br />
                    We provide web-based platform that brings together individuals who share common interests, goals, or activities. <br />
                </p>

                <div class="info">
                    <div class="information !text-textPrimary">
                        <MapPin className='!text-textPrimary h-5 w-5 icon'/> 
                        <p>92 Cherry Drive Uniondale, NY 11553</p>
                    </div>
                    <div class="information !text-textPrimary ">
                        <MailIcon className='!text-textPrimary h-5 w-5 icon' />
                        <p>nexunity@gmail.com</p>
                    </div>
                    <div class="information !text-textPrimary">
                        <PhoneCallIcon className='!text-textPrimary h-5 w-5 icon'/>   
                        <p>123-456-789</p>
                    </div>
                </div>

                {/* <div class="social-media">
                    <p className='!text-textPrimary'>Connect with us :</p>
                    <div class="social-icons">
                        <a href="#" className='flex justify-center items-center '>
                            <FaFacebook />
                        </a>
                        <a href="#" className='flex justify-center items-center '>
                            <FaTwitter />
                        </a>
                        <a href="#" className='flex justify-center items-center '>
                            <FaInstagram />
                        </a>
                        <a href="#" className='flex justify-center items-center '>
                            <FaLinkedin />
                        </a>
                    </div>
                </div> */}
            </div>

            <div class="contact-circle ">
                <span class="circle one"></span>
                <span class="circle two"></span>
            </div>
        </div>
    </div>
  )
}

export default ContactUsPage