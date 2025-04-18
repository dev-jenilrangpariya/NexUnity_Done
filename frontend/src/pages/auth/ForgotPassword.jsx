import { Mail } from "lucide-react";
import React from "react";
import img from "../../assets/images/frontHero/home header3.jpg";
import { Button } from "../../components/ui/Button";

const ForgotPassword = () => {
  return (
    <div className="w-full bg-backgroundv2 text-textPrimary grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="w-full hidden lg:flex md:justify-center md:items-center col-span-1">
        <div className="image_wrapper h-full w-full overflow-hidden">
          <img src={img} className="object-cover h-full w-full" alt="Logo" />
        </div>
      </div>
      <div className="login_wrapper flex items-center justify-center mx-2 ">
        <div className="bg-backgroundv1 text-textPrimary px-3 md:px-5 py-7 md:py-10 rounded-2xl w-full max-w-md shadow">
          <div className="">
            <div className="form-heading text-center mb-6 md:mb-10">
              <h3 className="text-textPrimary text-2xl md:text-3xl mb-3 font-semibold !leading-1.5">
                Forgot Password
              </h3>
              <p className="font-300 text-textPrimary text-sm  sm:text-base">
                Please enter the email that you use to sign in.
              </p>
            </div>
            <div className="form-body py-5">
              <form autoComplete="off">
                <div className="form-fields-wrapper mb-10">
                  <div className="form-group mb-6 md:mb-10">
                    <label className="block mb-3">Email Address</label>
                    <div className="w-full flex items-center h-12">
                      <div className="bg-[#F5F5F5] h-full flex justify-center items-center px-3 rounded-s-lg">
                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                      </div>
                      <input
                        placeholder="example@gmail.com"
                        className={
                          "w-full bg-[#F5F5F5] rounded-e-lg h-12 outline-none "
                        }
                      />
                    </div>
                  </div>
                  <h5 className="font-300 text-textPrimary text-sm text-center sm:text-base">
                    We will send you an email that will allow you to reset the
                    password{" "}
                  </h5>
                </div>
                <Button
                  variant={"blueV1"}
                  type="button"
                  className="w-full md:py-3.5 py-2.5 px-6 md:text-base text-sm md:px-12"
                >
                  Reset Password
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    //    <main className="auth-main-wrapper py-10 text-textPrimary min-h-screen scrollbar">
    //       <div className="auth-pages-wrapper">
    //         <section className="logo-section mb-8">
    //           <div className="container">
    //             <div className=" flex items-center justify-center">
    //               <Link href={"/"}>
    //                 {/* <img
    //               src={}
    //               alt={"logo"}
    //               width={192}
    //               height={132}
    //               className="max-w-[100px] xl:max-w-[140px]"
    //             /> */}
    //                 Logo
    //               </Link>
    //             </div>
    //           </div>
    //         </section>
    //         <div className="page-wrapper">
    //           <section className="checkout-section">
    //             <div className="">
    //               <div className="section-content-wrapper xl:max-w-[90%] xxl:max-w-[75%] mx-auto p-6 sm:py-14 sm:px-10 md:px-16 lg:px-28  border bg-white rounded-md">
    //                 <div className="form-heading text-center mb-6 md:mb-10">
    //                   <h3 className="text-textPrimary text-2xl md:text-3xl mb-3 font-semibold !leading-1.5">
    //                     Forgot Password
    //                   </h3>
    //                   <p className="font-300 text-textPrimary text-sm  sm:text-base">
    //                     Please enter the email that you use to sign in.
    //                   </p>
    //                 </div>
    //                 <div className="form-body">
    //                   <form autoComplete="off">
    //                     <div className="form-fields-wrapper mb-10">
    //                       <div className="form-group mb-6 md:mb-10">
    //                         <label className="block mb-3">Email Address</label>
    //                         <div className="w-full flex items-center h-12">
    //                           <div className="bg-[#F5F5F5] h-full flex justify-center items-center px-3 rounded-s-lg">
    //                             <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
    //                           </div>
    //                           <input
    //                             placeholder="example@gmail.com"
    //                             className={
    //                               "w-full bg-[#F5F5F5] rounded-e-lg h-12 outline-none "
    //                             }
    //                           />
    //                         </div>
    //                       </div>
    //                       <h5 className="font-300 text-textPrimary text-sm text-center sm:text-base">
    //                         We will send you an email that will allow you to
    //                         reset the password{" "}
    //                       </h5>
    //                     </div>
    //                     <Button
    //                       variant={"blueV1"}
    //                       type="button"
    //                       className="w-full md:py-3.5 py-2.5 px-6 md:text-base text-sm md:px-12"
    //                     >
    //                       Reset Password
    //                     </Button>
    //                   </form>
    //                 </div>
    //               </div>
    //             </div>
    //           </section>
    //         </div>
    //       </div>
    //     </main>
  );
};

export default ForgotPassword;


