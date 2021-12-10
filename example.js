import { ColorExtractor } from "image-color-extraction";

const extractor = new ColorExtractor();

extractor
  .extractColor("http://blog.xiong35.cn/color-extract/3.jpg")
  .then(() => {
    console.log(extractor.colors);
    /* 
      [
        {color: '#383143', count: 296014},
        {color: '#d6bca9', count: 87642},
        {color: '#a35560', count: 58061},
        {color: '#d39470', count: 18149},
        {color: '#666187', count: 13415},
        {color: '#9e6d8c', count: 12094},
      ]
    */
    console.log(extractor.chooseReadableColor());
    /* 
      ['#383143', '#d6bca9']
     */
  });
