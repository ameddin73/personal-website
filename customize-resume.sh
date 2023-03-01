#!/bin/bash

sed -e "s/\/\* skills \*\//$2/g" \
    -e "s/<\!-- goal -->/$1/g" \
    -e "s/hidden//g" \
    src/pages/resume/customizer-template.html > src/pages/resume/customizer.html
