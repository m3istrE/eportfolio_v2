// TemplateID: template_tmumtro
// ServiceID: service_h3lv0ku
// UserID: jVsHuaxsPFTEcB-o_

function contact(event) {
    // event.preventDefault();
    // emailjs
    //   .sendForm('service_h3lv0ku', 'template_tmumtro',event.target,'jVsHuaxsPFTEcB-o_').then(() => {
    //     console.log('SUCCESS!');
    //   })

    const loading = document.querySelector('.modal__overlay--loading');
    const success = document.querySelector('.modal__overlay--success');
    loading.classList += " modal__overlay--visible";
    setTimeout(() => {
      loading.classList.remove("modal__overlay--visible");
      success.classList += " modal__overlay--visible";
      console.log('SUCCESS!');
    }, 1000);
}
