import{M as r}from"./MovieDetails-twNCOv6Y.js";import{_ as n,c as i,a,r as c,o as m}from"./index-C53QClnh.js";const v={components:{MovieDetails:r},data(){return{movies:[]}},mounted(){this.fetchMovies()},methods:{async fetchMovies(){try{const o=await fetch(`${this.$hostname}/movies`);if(!o.ok)throw new Error("Network response was not ok");const e=await o.json();this.movies=e}catch(o){console.error("Error fetching movies: ",o)}}}};function p(o,e,l,f,s,h){const t=c("MovieDetails");return m(),i("div",null,[a(t,{movies:s.movies},null,8,["movies"])])}const u=n(v,[["render",p]]);export{u as default};