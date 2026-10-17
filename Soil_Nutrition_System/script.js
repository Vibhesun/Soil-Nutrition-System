const $ = (id) => document.getElementById(id);
const initial = { moisture: 56, temperature: 27, ph: 6.5 };
let readings = [48, 52, 49, 61, 58, 56];

function statusFor(data) {
  const suggestions = [];
  let moistureStatus = 'Moderate moisture';
  if (data.moisture < 30) {
    moistureStatus = 'Low moisture';
    suggestions.push({ icon: '!', text: 'The sample moisture is low. Check the crop’s irrigation needs and verify the sensor before watering.' });
  } else if (data.moisture > 75) {
    moistureStatus = 'High moisture';
    suggestions.push({ icon: '!', text: 'The sample moisture is high. Check drainage and avoid adding water until conditions are verified.' });
  } else {
    suggestions.push({ icon: '✓', text: 'Moisture is within the demo’s moderate band. Continue observing the trend and crop requirements.' });
  }
  let tempStatus = 'Within sample range';
  if (data.temperature < 15) {
    tempStatus = 'Cool conditions';
    suggestions.push({ icon: '•', text: 'The sample soil temperature is low. Compare with local crop guidance and monitor for changes.' });
  } else if (data.temperature > 35) {
    tempStatus = 'Warm conditions';
    suggestions.push({ icon: '!', text: 'The sample soil temperature is high. Check the sensor placement and consider local heat-management practices.' });
  }
  let phStatus = 'Near neutral';
  if (data.ph < 5.5) {
    phStatus = 'Acidic';
    suggestions.push({ icon: '•', text: 'The sample pH is acidic. Confirm with a calibrated test and check crop-specific pH requirements before amending soil.' });
  } else if (data.ph < 6.5) {
    phStatus = 'Slightly acidic';
    suggestions.push({ icon: '✓', text: 'The sample pH is slightly acidic. Suitability depends on the crop and soil type.' });
  } else if (data.ph <= 7.5) {
    phStatus = 'Near neutral';
    suggestions.push({ icon: '✓', text: 'The sample pH is near neutral. Check whether this fits the crop’s preferred range.' });
  } else {
    phStatus = 'Alkaline';
    suggestions.push({ icon: '•', text: 'The sample pH is alkaline. Confirm with a reliable soil test before considering any treatment.' });
  }
  const moistureScore = 100 - Math.min(100, Math.abs(data.moisture - 55) * 1.7);
  const tempScore = 100 - Math.min(100, Math.abs(data.temperature - 25) * 3.2);
  const phScore = 100 - Math.min(100, Math.abs(data.ph - 6.5) * 12);
  const health = Math.round((moistureScore * .35) + (tempScore * .25) + (phScore * .4));
  return { suggestions, moistureStatus, tempStatus, phStatus, health };
}

function drawChart(values) {
  const svg = $('moistureChart');
  const width = 700, height = 190, left = 24, right = 12, top = 12, bottom = 18;
  const plotW = width - left - right, plotH = height - top - bottom;
  const y = v => top + (100 - v) / 100 * plotH;
  const x = i => left + i / (values.length - 1) * plotW;
  let markup = '';
  [0,25,50,75,100].forEach(v => {
    markup += `<line x1="${left}" y1="${y(v)}" x2="${width-right}" y2="${y(v)}" stroke="#294537" stroke-width="1" stroke-dasharray="3 5"/>`;
    markup += `<text x="0" y="${y(v)+3}" fill="#779482" font-size="9">${v}</text>`;
  });
  const points = values.map((v,i)=>`${x(i)},${y(v)}`).join(' ');
  const area = `${left},${height-bottom} ${points} ${width-right},${height-bottom}`;
  markup += `<polygon points="${area}" fill="#78e69a" opacity=".08"/>`;
  markup += `<polyline points="${points}" fill="none" stroke="#78e69a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  values.forEach((v,i)=>{ markup += `<circle cx="${x(i)}" cy="${y(v)}" r="${i===values.length-1?5:3}" fill="${i===values.length-1?'#d7ffe0':'#78e69a'}" stroke="#0b1d14" stroke-width="2"/>`; });
  svg.innerHTML = markup;
}

function updateUI(data) {
  const state = statusFor(data);
  $('moistureValue').textContent = data.moisture;
  $('moistureBar').style.width = `${data.moisture}%`;
  $('moistureStatus').textContent = state.moistureStatus;
  $('tempValue').textContent = Number(data.temperature).toFixed(1);
  $('tempStatus').textContent = state.tempStatus;
  $('phValue').textContent = Number(data.ph).toFixed(1);
  $('phStatus').textContent = state.phStatus;
  $('healthValue').textContent = state.health;
  $('healthBar').style.width = `${state.health}%`;
  $('heroHealth').innerHTML = `${state.health}<span>/100</span>`;
  $('heroHealthBar').style.width = `${state.health}%`;
  $('stripMoisture').textContent = `${data.moisture}%`;
  $('stripTemp').textContent = `${Number(data.temperature).toFixed(0)}°C`;
  $('stripPH').textContent = Number(data.ph).toFixed(1);
  $('moistureSlider').value = data.moisture;
  $('tempSlider').value = data.temperature;
  $('phSlider').value = data.ph;
  $('moistureSliderValue').textContent = data.moisture;
  $('tempSliderValue').textContent = Number(data.temperature).toFixed(0);
  $('phSliderValue').textContent = Number(data.ph).toFixed(1);
  $('recommendations').innerHTML = state.suggestions.map(s => `<div class="recommendation"><span>${s.icon}</span><p>${s.text}</p></div>`).join('');
  readings = [...readings.slice(1), data.moisture];
  drawChart(readings);
}

['moistureSlider','tempSlider','phSlider'].forEach(id => {
  $(id).addEventListener('input', () => {
    updateUI({
      moisture: Number($('moistureSlider').value),
      temperature: Number($('tempSlider').value),
      ph: Number($('phSlider').value)
    });
  });
});
$('randomizeBtn').addEventListener('click', () => {
  const data = {
    moisture: Math.round(15 + Math.random() * 75),
    temperature: Math.round((12 + Math.random() * 27) * 10) / 10,
    ph: Math.round((4.2 + Math.random() * 4.5) * 10) / 10
  };
  updateUI(data);
});
$('resetBtn').addEventListener('click', () => {
  readings = [48,52,49,61,58,56];
  updateUI(initial);
});
const menuToggle = $('menuToggle');
const mainNav = $('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
drawChart(readings);
updateUI(initial);
