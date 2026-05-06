class Carousel {
  constructor() {
    this.slider     = document.getElementById("slider");
    this.slides     = document.querySelectorAll(".slide");
    this.indicators = document.querySelectorAll(".indicator");
    this.prevBtn    = document.querySelector(".carousel-btn-prev");
    this.nextBtn    = document.querySelector(".carousel-btn-next");
    this.pageBg     = document.getElementById("page-bg");

    this.currentSlide = 0;
    this.totalSlides  = this.slides.length;
    this.isAnimating  = false;

    this.init();
  }

  init() {
    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft")  this.prevSlide();
      if (e.key === "ArrowRight") this.nextSlide();
    });

    this.addTouchSupport();
    this.updateSlider();
  }

  prevSlide() {
    if (this.isAnimating) return;
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlider();
  }

  nextSlide() {
    if (this.isAnimating) return;
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlider();
  }

  goToSlide(index) {
    if (this.isAnimating || index === this.currentSlide) return;
    this.currentSlide = index;
    this.updateSlider();
  }

  updateSlider() {
    this.isAnimating = true;

    // Mise à jour des classes de position 3D
    this.slides.forEach((slide, index) => {
      slide.classList.remove("active", "prev", "next", "far-prev", "far-next");
      const position = this.getSlidePosition(index);
      if (position) slide.classList.add(position);
    });

    // Mise à jour des indicateurs
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentSlide);
    });

    // Mise à jour du fond pleine page via data-bg du slide actif
    this.updateBackground();

    setTimeout(() => { this.isAnimating = false; }, 650);
  }

  updateBackground() {
    const activeSlide = this.slides[this.currentSlide];
    if (!activeSlide || !this.pageBg) return;

    const bg = activeSlide.dataset.bg;
    if (bg) {
      this.pageBg.style.background = bg;
    }
  }

  getSlidePosition(index) {
    const diff = index - this.currentSlide;
    const total = this.totalSlides;

    let normalizedDiff = diff;
    if (Math.abs(diff) > total / 2) {
      normalizedDiff = diff > 0 ? diff - total : diff + total;
    }

    switch (normalizedDiff) {
      case  0: return "active";
      case -1: return "prev";
      case  1: return "next";
      case -2: return "far-prev";
      case  2: return "far-next";
      default: return null;
    }
  }

  addTouchSupport() {
    let startX = 0;

    this.slider.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    this.slider.addEventListener("touchend", (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.nextSlide() : this.prevSlide();
      }
    }, { passive: true });
  }

  // Auto-play (décommenter pour activer)
  // startAutoPlay(interval = 4000) {
  //   this.autoPlayInterval = setInterval(() => this.nextSlide(), interval);
  //   this.slider.addEventListener("mouseenter", () => clearInterval(this.autoPlayInterval));
  //   this.slider.addEventListener("mouseleave", () => this.startAutoPlay(interval));
  // }
}

document.addEventListener("DOMContentLoaded", () => {
  new Carousel();
});
