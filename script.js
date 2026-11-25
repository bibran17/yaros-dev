const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const menuLabel = document.querySelector('.menu-label');
const navigation = document.querySelector('#site-nav');
const mobileQuery = window.matchMedia('(max-width: 800px)');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function setMenu(open) {
  const isMobile = mobileQuery.matches;
  const shouldOpen = isMobile && open;

  menuButton.setAttribute('aria-expanded', String(shouldOpen));
  menuLabel.textContent = shouldOpen ? 'Закрыть' : 'Меню';
  navigation.classList.toggle('is-open', shouldOpen);
  document.body.classList.toggle('menu-open', shouldOpen);
  navigation.inert = isMobile && !shouldOpen;
}

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 12);
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    setMenu(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

document.addEventListener('click', (event) => {
  if (menuButton.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) {
    setMenu(false);
  }
});

mobileQuery.addEventListener('change', () => setMenu(false));
window.addEventListener('scroll', updateHeader, { passive: true });

setMenu(false);
updateHeader();

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !reducedMotionQuery.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const copyPhoneButton = document.querySelector('[data-copy-phone]');
const copyStatus = document.querySelector('.copy-status');
let copyStatusTimer;

function showCopyStatus(message) {
  clearTimeout(copyStatusTimer);
  copyStatus.textContent = message;
  copyStatus.classList.add('is-visible');
  copyStatusTimer = setTimeout(() => copyStatus.classList.remove('is-visible'), 3500);
}

function copyWithTemporaryField(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, text.length);
  let copied = false;

  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  } finally {
    textArea.remove();
    copyPhoneButton.focus();
  }

  return copied;
}

copyPhoneButton.addEventListener('click', () => {
  const phone = copyPhoneButton.dataset.copyPhone;

  if (copyWithTemporaryField(phone)) {
    showCopyStatus('Номер скопирован: +7 993 721-17-06');
    return;
  }

  if (navigator.clipboard && window.isSecureContext) {
    const clipboardTimeout = setTimeout(() => {
      showCopyStatus('Скопируйте номер: +7 993 721-17-06');
    }, 1500);

    navigator.clipboard.writeText(phone).then(() => {
      clearTimeout(clipboardTimeout);
      showCopyStatus('Номер скопирован: +7 993 721-17-06');
    }).catch(() => {
      clearTimeout(clipboardTimeout);
      showCopyStatus('Скопируйте номер: +7 993 721-17-06');
    });
    return;
  }

  showCopyStatus('Скопируйте номер: +7 993 721-17-06');
});
