/*
 * 12주차 인터랙티브반 공통 실습 시작 파일
 *
 * 구현됨: 페이지 진입 애니메이션과 연도별 실업률 콘텐츠 전환.
 *
 * Copilot Agent 실습에서 수정할 부모: .compare-section
 * 선택 버튼: .year-button-a / .year-button-b
 * 변경 대상: .year-rate / .year-description / .year-chart
 */

// 기존에 정상 작동하는 화면 진입 효과. 기능 추가 시 유지한다.
document.documentElement.classList.add('has-js');
const revealSections = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealSections.forEach((section) => observer.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add('is-visible'));
}

const numberAnimationFrames = new WeakMap();
const animateNumber = (element, target) => {
  if (!element) return;

  cancelAnimationFrame(numberAnimationFrames.get(element));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.firstChild.textContent = target.toFixed(1);
    return;
  }

  const start = Number(element.firstChild.textContent) || 0;
  const startTime = performance.now();
  const duration = 1000;

  const updateNumber = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = start + (target - start) * easedProgress;
    element.firstChild.textContent = currentValue.toFixed(1);

    if (progress < 1) {
      numberAnimationFrames.set(element, requestAnimationFrame(updateNumber));
    } else {
      numberAnimationFrames.delete(element);
    }
  };

  numberAnimationFrames.set(element, requestAnimationFrame(updateNumber));
};

animateNumber(document.querySelector('.hero-big-number'), 4.2);

const yearData = {
  a: {
    label: 'YEAR A',
    title: '연도 A의 실업률 변화',
    description: '연도 A를 선택한 화면입니다. 학습용 가상 수치를 기반으로 그래프와 설명이 표시됩니다.',
    rate: '4.2',
    chart: 'images/year-a.svg',
    chartAlt: '가상 데이터 연도 A 실업률 추이 그래프',
    chartStatus: '연도 A 그래프가 표시 중입니다.',
  },
  b: {
    label: 'YEAR B',
    title: '연도 B의 실업률 변화',
    description: '연도 B를 선택한 화면입니다. 학습용 가상 수치를 기반으로 그래프와 설명이 표시됩니다.',
    rate: '3.6',
    chart: 'images/year-b.svg',
    chartAlt: '가상 데이터 연도 B 실업률 추이 그래프',
    chartStatus: '연도 B 그래프가 표시 중입니다.',
  },
};

const compareSection = document.querySelector('.compare-section');
if (compareSection) {
  const buttons = {
    a: compareSection.querySelector('.year-button-a'),
    b: compareSection.querySelector('.year-button-b'),
  };
  const rate = compareSection.querySelector('.year-rate');
  const yearLabel = compareSection.querySelector('.year-label');
  const title = compareSection.querySelector('.metric-title');
  const description = compareSection.querySelector('.year-description');
  const chart = compareSection.querySelector('.year-chart');
  const chartLabel = compareSection.querySelector('.chart-footer span');
  const chartStatus = compareSection.querySelector('.chart-status');
  const practiceStatus = compareSection.querySelector('.practice-status');

  const selectYear = (year) => {
    const data = yearData[year];
    animateNumber(rate, Number(data.rate));
    yearLabel.textContent = data.label;
    title.textContent = data.title;
    description.textContent = data.description;
    chart.src = data.chart;
    chart.alt = data.chartAlt;
    chartLabel.textContent = `연도 ${year.toUpperCase()}`;
    chartStatus.textContent = data.chartStatus;
    practiceStatus.lastChild.textContent = ` ${chartLabel.textContent} 학습용 가상 데이터가 표시 중입니다.`;

    Object.entries(buttons).forEach(([buttonYear, button]) => {
      const isSelected = buttonYear === year;
      button.classList.toggle('active', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
  };

  Object.entries(buttons).forEach(([year, button]) => {
    button.addEventListener('click', () => selectYear(year));
  });

  animateNumber(rate, Number(yearData.a.rate));
}
