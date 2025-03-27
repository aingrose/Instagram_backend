const axios = require('axios')
const dotenv = require('dotenv');
const FormData = require('form-data')
const fs = require('fs');
const { type } = require('os');
const { text } = require('stream/consumers');

// dotenv.config()
// async function sendTemplateMessage(){
//     const data = new FormData()
//     data.append("Messaging_product","whatsapp")
   
//     const response = await axios({
//       url :' https://graph.facebook.com/v22.0/577874205411500/messages',
//       method:'post',
//       headers:{
//         'Authorization' : `Bearer ${process.env.WHATSAPP_TOKEN }`,
        
//       },
//       data
//     })
//     console.log(response.data);
    
//   }


// async function sendTemplateMessage() {
//     try {
//         const response = await axios({
//             url: 'https://graph.facebook.com/v22.0/577874205411500/messages',
//             method: 'post',
//             headers: {
//                 'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             },
//             data: JSON.stringify({
//                 messaging_product: 'whatsapp',
//                 to: '918610382228',  // Your recipient's WhatsApp number
//                 type: 'template',
//                 template: {
//                     name: 'discount',
//                     language: {
//                         code: 'en_US'
//                     },
                    //extr
                    // Components:[
                    //   {
                    //     type:'header',
                    //     parameter:[{
                    //       type:'text',
                    //       text:'john doe'
                    //     },
                    //     ]
                    //   },
                    //   {
                    //     type:'body',
                    //     parameter:[{
                    //       type:'text',
                    //       text:'50'
                    //     },
                    //     ]
                    //   }
                    // ]
//                 }
//             })
//         });

//         console.log('Message Sent Successfully:', response.data);
//     } catch (error) {
//         console.error('Error Sending Message:', error.response ? error.response.data : error.message);
//     }
// }

// async function sendTextMessage(){
//   try {
//     const response = await axios({
//         url: 'https://graph.facebook.com/v22.0/577874205411500/messages',
//         method: 'post',
//         headers: {
//             'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//         },
//         data: {
//             messaging_product: 'whatsapp',
//             to: '918610382228',  // Your recipient's WhatsApp number
//             type: 'text',
//             text: {
//                body:'this is a text message'
//             }
//         }
//     });

//     console.log('Message Sent Successfully:', response.data);
// } catch (error) {
//     console.error('Error Sending Message:', error.response ? error.response.data : error.message);
// }
// }

// async function sendMediaMessage() {
//   const response = await axios({
//     url: 'https://graph.facebook.com/v22.0/577874205411500/messages',
//     method: 'post',
//     headers: {
//         'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     },
//     data: {
//         messaging_product: 'whatsapp',
//         to: '918610382228',  // Your recipient's WhatsApp number
//         type: 'template',
//         template: {
//             name: 'hello_world',
//             language: {
//                 code: 'en_US'
//             }
//         }
//     }
// });

// console.log('Message Sent Successfully:', response.data);
// } 


// async function sendMediaMessage(){
// try {
// const response = await axios({
// url: 'https://graph.facebook.com/v22.0/577874205411500/messages',
// method: 'post',
// headers: {
//     'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
// },
// data: {
//     messaging_product: 'whatsapp',
//     to: '918610382228', 
//     type: 'image',
//     image: {
      
//       //link :'https://picsum.photos/seed/picsum/200/300',
//       caption:'this is media message'
//     }
// }
// });

// console.log('Message Sent Successfully:', response.data);
// } catch (error) {
// console.error('Error Sending Message:', error.response ? error.response.data : error.message);
// }
// }


// async function uploadImage(){
  
// try {
//   const data = new FormData()
//   data.append("message_product",'whatsapp')
//   data.append("file",fs.createReadStream(process.cwd()+'D:\Projects/social-media-app/be./logo.jpg')),{contentType:'image/png'}
//   data.append('type','image/png')

//   const response = await axios({
//   url: 'https://graph.facebook.com/v22.0/577874205411500/media',
//   method: 'post',
//   headers: {
//       'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
    
//   }, 
//   data: data 
//   });
  
//   console.log('Message Sent Successfully:', response.data);
//   } catch (error) {
//   console.error('Error Sending Message:', error.response ? error.response.data : error.message);
//   }
// }
// uploadImage()







// sendTemplateMessage();
  
//sendTextMessage()
  //sendMediaMessage()


  //EAAWdeAr5kTQBO1fyZCbNZBsIQTxOBzARHmyDAXsM3ltsmr08FZBG02eRE2VcKUs3ZCnQZBZAY0J4iZAr8MrdXzPQzRU7Aqo6xnStm6DZBQINuikGEvccGj3C3g5xZAYCq7TrtM8BRS4VgvcCatryZBJ1iyk0npSnz5ryYhYPuqHgD06vr5pFudjz9IcZCF92XSXOQ4S

  //EAAWdeAr5kTQBO7IMP27ZAiTxolLr6L6Mo7fEO882BPO8ubi21NftE4j0lKryjhZAPbrZCLUTRz4LRBJurkMmtxbzXX34T9sw7tFhr7IiDPHaZCYhFdriRgxKiRZCOszbM2ysMpIJDkrTZAtOhIKtCgKOADVFE9fAUNFOoVtgB2fw9cdxOGIbM1BaAGeI6JBYeOYCHolJZCSP06RbxYmL8FxH1dvW5tg&data_access_expiration_time=1749377211&expires_in=6788

  //https://graph.facebook.com/v18.0/me?fields=id,name&access_token=EAAWdeAr5kTQBOzZCH7nxZBcv2n3mVlYI8NYOsnSOODCSMdUZA1XpxZCWq7crZACsuvh5zimWLYUhwEKRZBFoKEcs8k4zp0eETfWgC1Unj0Dypx08AusJa3yP7dfW3nNziKZBXuop53DUlUqiRJZBndZCKFkpwvTv1kZBKXXKLWSanWqKq1gGaVm41CNQn916Ofm2yW 
  

  //IGAAJXkEe2LZBFBZAE1UV25nWEN2ZAnRRZA20zUW1DMWVEanM3TnR4TDRMaVREX2I5eU82WWdFSlJ5b3d1TXZAVZAGhBaVJOdGxaMTBIWm1ab0JFc0FieThCazJwZAjZAFMUtma05qWUJIU0J6VEM3anZA2SGtTT3J5YlVXel9vWE1hTTRjSQZDZD
   
  // const ACCESS_TOKEN = "IGAAJXkEe2LZBFBZAE1SOG9MWkhsTk9TVTJEZAktpLThhUEVBMzdaSTFCdElObVU4QThtQjdEc0cwVmNnS1NYc2ZAkWDFmemRJdVBVOGdtWkZApY1hMR1puc2NrZATNXN0N0dGM3azFUaFU0NjJUMjN4R3NfZA0YwOE96TnFhZAzFNMlFrawZDZD"
  // const INSTAGRAM_ACCOUNT_ID = "1580513789317428";

  // const sendMessage = async() =>{
  //    try{
  //       const response = await axios.post(
  //           `https://graph.facebook.com/v21.0/${INSTAGRAM_ACCOUNT_ID}/messages`,
      
  //           {
  //           recipient: { id: RECIPIENT_ID },
  //           message: { text: "Hello, this is a test message from my Node.js app!" },
  //             },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${ACCESS_TOKEN}`,
  //                 "Content-Type": "application/json",
  //               },
  //             }
  //           );
  //           console.log(" Message sent successfully:", response.data);
        
  //    }
  //    catch(error){
  //       console.error(" Error sending message:", error.response ? error.response.data : error.message);
  //    }
  // } 

  // sendMessage()