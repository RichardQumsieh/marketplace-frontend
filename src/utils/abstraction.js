export const userPrevilegeCheck = () => {
    if (localStorage.getItem('type') === 'Delivery') window.location.href='/delivery/profile';
    else if (localStorage.getItem('type') === 'Seller') window.location.href='/seller-profile/Dashboard';
    else if (localStorage.getItem('type') === 'Admin') window.location.href='/dashboard';
};