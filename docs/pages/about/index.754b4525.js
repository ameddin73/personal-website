function rewrite(t){const e=$("#about_tagline_text");let n=e.text();function i(){setTimeout((function(){n=n.slice(0,-1),e.text(n),n.length>0?i():s()}),50)}i();const l=popTagline(t);t=l.altTags;let o=l.newTagline,a=1;function s(){setTimeout((function(){if(n=o.slice(0,a),a++,e.text(n),n.length<o.length)s();else{a=1,t.length<=0&&(t=buildTaglines(o));const e=popTagline(t);t=e.altTags,o=e.newTagline,setTimeout(i,2e3)}}),100)}}function popTagline(t){const e=t[Math.floor(Math.random()*t.length)],n=t.indexOf(e);return n>-1&&t.splice(n,1),{altTags:t,newTagline:e}}function buildTaglines(t){let e=[];if($(".about_tagline_alt_text").each((function(){e.push($(this).text())})),t){const n=e.indexOf(t);n>-1&&e.splice(n,1)}return e}$((function(){let t=buildTaglines();setTimeout((()=>{rewrite(t)}),4e3)}));
//# sourceMappingURL=index.754b4525.js.map
