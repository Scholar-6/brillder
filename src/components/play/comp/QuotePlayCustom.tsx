import React from 'react';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


interface TextProps {
  quoteHtml: string;
}

const QuotePlayCustom: React.FC<TextProps> = ({ quoteHtml }) => {
  const [isOverflowing, setOverflowing] = React.useState(false);

  React.useEffect(() => {
    try {
      var regex = /(?<=<blockquote class="bq no-break"\>)(.*?)(?=<\/blockquote>)/gi;
      var lines = quoteHtml.match(regex);
      if (lines) {
        for (let line of lines) {
          if (line.length > 50) {
            setOverflowing(true);
          }
        }
      }
    } catch (e) { /* can`t parse quote*/ }
  }, [quoteHtml]);


  return (
    <div className="text-ff">
      {isOverflowing ?
        <div className="scroll-sideways-hint">
          <SpriteIcon name="flaticon-swipe" />
          <div>Scroll sideways to read longer lines</div>
        </div> : ''}
      <div dangerouslySetInnerHTML={{ __html: quoteHtml }} />
    </div>
  );
}

export default QuotePlayCustom;
