// TemplateID: template_tmumtro
// ServiceID: service_h3lv0ku
// UserID: jVsHuaxsPFTEcB-o_

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
}
