//@ts-ignore
import Desmos from 'desmos';

export const renderGraph = (el: Element) => {
  const value = JSON.parse(el.getAttribute("data-value") as string);

  const desmos = Desmos.GraphingCalculator(el, {
    fontSize: Desmos.FontSizes.VERY_SMALL,
    expressions: false,
    settingsMenu: false,
    lockViewport: true,
    pointsOfInterest: true,
    trace: true,
  });
  desmos.setState(value.graphState);

  return desmos;
}
