// TemplateID: template_tmumtro
// ServiceID: service_h3lv0ku
// UserID: jVsHuaxsPFTEcB-o_

// function contact(event) {

//     const loading = document.querySelector('.modal__overlay--loading');
//     console.log('loading')
//     const success = document.querySelector('.modal__overlay--success');
//     console.log('success')
//     loading.classList += " modal__overlay--visible";
//     console.log('loading');
//     setTimeout(() => {
//       loading.classList.remove(" modal__overlay--visible");
//       success.classList += " modal__overlay--visible";
//       console.log('SUCCESS!');
//     }, 1000);
// }

// event.preventDefault();
// emailjs
//   .sendForm('service_h3lv0ku', 'template_tmumtro',event.target,'jVsHuaxsPFTEcB-o_').then(() => {
//     console.log('SUCCESS!');
//   })

function contact(event) {
  event.preventDefault();
  const loading = document.querySelector('.modal__overlay--loading');
  const success = document.querySelector('.modal__overlay--success');

  loading.classList.toggle("modal__overlay--visible");

  emailjs
  .sendForm('service_h3lv0ku', 'template_tmumtro',event.target,'jVsHuaxsPFTEcB-o_').then(() => {
    loading.classList.toggle("modal__overlay--visible");
    success.classList.toggle("modal__overlay--visible");
  })

  // submit the form and handle the response
  // submitForm().then(() => {
  //   loading.classList.toggle("modal__overlay--visible");
  //   console.log('SUCCESS!');
  //   success.classList.toggle("modal__overlay--visible");
  // }).catch(() => {
  //   loading.classList.toggle("modal__overlay--visible");
  //   // show an error message instead of the success message
  // });
  // setTimeout(() => {
  //   loading.classList.toggle("modal__overlay--visible");
  //   success.classList.toggle("modal__overlay--visible");
  //   console.log('SUCCESS!');
  // }, 1000);
}
