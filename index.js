// TemplateID: template_tmumtro
// ServiceID: service_h3lv0ku
// UserID: jVsHuaxsPFTEcB-o_

// function contact(event) {
//   event.preventDefault();
//   const loading = document.querySelector('.modal__overlay--loading');
//   const success = document.querySelector('.modal__overlay--success');

//   loading.classList.toggle("modal__overlay--visible");

//   emailjs
//   .sendForm('service_h3lv0ku', 'template_tmumtro',event.target,'jVsHuaxsPFTEcB-o_').then(() => {
//     loading.classList.toggle("modal__overlay--visible");
//     success.classList.toggle("modal__overlay--visible");
//   }).catch(() => {
//     loading.classList.toggle("modal__overlay--visible");
//     alert(
//       "The email service is temporarily unavailable. Contact me directly on v-2krisg@outlook.com"
//     )
//   })
// }

async function contact(event) {
  event.preventDefault();
  const loading = document.querySelector('.modal__overlay--loading');
  const success = document.querySelector('.modal__overlay--success');

  loading.classList.toggle("modal__overlay--visible");

  try {
    await emailjs.sendForm('service_h3lv0ku', 'template_tmumtro', event.target, 'jVsHuaxsPFTEcB-o_');
    loading.classList.toggle("modal__overlay--visible");
    success.classList.toggle("modal__overlay--visible");
  } catch (error) {
    loading.classList.toggle("modal__overlay--visible");
    alert("The email service is temporarily unavailable. Contact me directly on v-2krisg@outlook.com");
  }
}


function toggleModal(event) {
  document.body.classList.toggle("modal--open");
}

function toggleContrast(event) {
  document.body.classList.toggle("dark-theme");
}

//how to use async instead of then for sending an email?