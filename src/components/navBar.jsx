import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/component_style.css";

const moreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="currentColor" d="M176 416a112 112 0 1 0 0 224a112 112 0 0 0 0-224m0 64a48 48 0 1 1 0 96a48 48 0 0 1 0-96zm336-64a112 112 0 1 1 0 224a112 112 0 0 1 0-224zm0 64a48 48 0 1 0 0 96a48 48 0 0 0 0-96zm336-64a112 112 0 1 1 0 224a112 112 0 0 1 0-224zm0 64a48 48 0 1 0 0 96a48 48 0 0 0 0-96z"/></svg>
);

const moreIconActive = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 344 384"><path fill="currentColor" d="M42.5 149q17.5 0 30 12.5T85 192t-12.5 30.5t-30 12.5t-30-12.5T0 192t12.5-30.5t30-12.5zm256 0q17.5 0 30 12.5T341 192t-12.5 30.5t-30 12.5t-30-12.5T256 192t12.5-30.5t30-12.5zm-128 0q17.5 0 30 12.5T213 192t-12.5 30.5t-30 12.5t-30-12.5T128 192t12.5-30.5t30-12.5z"/></svg>
);

const discoverIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 20.8a8.8 8.8 0 1 0 0-17.6a8.8 8.8 0 0 0 0 17.6m0 1.2C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-.877-10.877l-1.856 3.61l3.61-1.856l1.856-3.61zm-.89-.89l5.891-3.03a.5.5 0 0 1 .674.673l-3.03 5.892l-5.892 3.03a.5.5 0 0 1-.674-.674l3.03-5.892z"/></svg>
);

const discoverIconActive = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-1.396-11.396l-2.957 5.749l5.75-2.957l2.956-5.749l-5.75 2.957z"/></svg>
);

const uploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-6-6h12"/></svg>
);

const uploadIconActive = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="currentColor" d="M8 7V3.5a.5.5 0 0 0-1 0V7H3.5a.5.5 0 0 0 0 1H7v3.5a.5.5 0 1 0 1 0V8h3.5a.5.5 0 1 0 0-1zm-.5 8a7.5 7.5 0 1 1 0-15a7.5 7.5 0 0 1 0 15"/></svg>
);

const feedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m1.5 10.5l9-9l9 9"/><path d="M3.5 8.5v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></g></svg>
);

const feedIconActive = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M10.772 2.688a2 2 0 0 1 2.456 0l8.384 6.52c.753.587.337 1.792-.615 1.792H20v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8h-.997c-.953 0-1.367-1.206-.615-1.791l8.384-6.52Z"/></g></svg>
);

function NavItem({ to, label, ActiveIcon, DefaultIcon }) {
  return (
    <NavLink to={to} className="flex flex-col items-center justify-center" end>
      {({ isActive }) => (isActive ? <ActiveIcon /> : <DefaultIcon />)}
    </NavLink>
  );
}

function Navbar() {
  return (
    <motion.nav className="w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/3 
            fixed bottom-1 md:bottom-5 lg:bottom-5 left-1/2 transform -translate-x-1/2 
            flex justify-around items-center 
            space-x-4 sm:space-x-6 p-4
            rounded-[60px]  bg-white/30 backdrop-blur-lg 
            z-50"
            whileHover={{ scale: 1.05 }} 
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <NavItem to="/feed" label="Feed" ActiveIcon={feedIconActive} DefaultIcon={feedIcon} />
      {/*<NavItem to="/discover" label="Discover" ActiveIcon={discoverIconActive} DefaultIcon={discoverIcon} />*/}
      <NavItem to="/upload" label="Upload" ActiveIcon={uploadIconActive} DefaultIcon={uploadIcon} />
      <NavItem to="/more" label="More" ActiveIcon={moreIconActive} DefaultIcon={moreIcon} />
    </motion.nav>
  );
}

export default Navbar;
