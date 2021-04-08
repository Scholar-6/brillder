const baseColors = [
  { color: "#C43C30", label: "Red" },
  { color: "#0681DB", label: "Blue" },
  { color: "#30C474", label: "Green" }
];

const expandedColors = [
  ...baseColors,
  { color: '#FF9D00', label: 'Yellow' },
  { color: '#6A2E15', label: 'Brown' },
  { color: '#4523FF', label: 'Purple' },
  { color: '#FC7502', label: 'Orange' },
  { color: '#001C58', label: 'DarkBlue' }
]

export default {
  baseColors,
  expandedColors
}
