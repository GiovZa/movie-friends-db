import{M as i}from"./MovieDetails-twNCOv6Y.js";import{_ as a,c as l,w as c,v as d,b as u,a as m,r as v,o as p}from"./index-C53QClnh.js";const h={components:{MovieDetails:i},data(){return{userId:0,movies:[]}},methods:{async fetchRankedMovies(){if(!this.userId&&this.userId!=0){this.movies=[];return}try{console.log("Request URL:",`${this.$hostname}/rank-user-movies`),console.log(JSON.stringify({userId:this.userId}));const e=await(await fetch("http://localhost:5173/rank-user-movies",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})})).json();this.movies=e,console.log(e)}catch(s){console.error("Error fetching ranked movies:",s),this.movies=[]}}}};function f(s,e,I,k,o,r){const n=v("MovieDetails");return p(),l("div",null,[c(u("input",{type:"number","onUpdate:modelValue":e[0]||(e[0]=t=>o.userId=t),placeholder:"Enter User ID",onInput:e[1]||(e[1]=(...t)=>r.fetchRankedMovies&&r.fetchRankedMovies(...t))},null,544),[[d,o.userId]]),m(n,{movies:o.movies},null,8,["movies"])])}const _=a(h,[["render",f]]);export{_ as default};
