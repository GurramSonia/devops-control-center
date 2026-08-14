

function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
}