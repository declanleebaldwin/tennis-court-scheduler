<template>
    <div id="app">
        <section class="hero is-success">
            <div class="hero-head">
                <header class="navbar">
                    <div class="container">
                        <div class="navbar-brand">
                            <span class="navbar-burger burger" data-target="navbarMenuHeroC">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </div>
                        <div id="navbarMenuHeroC" class="navbar-menu">
                            <div class="navbar-end">
                                <a class="navbar-item is-active">
                                    Make a Booking
                                </a>
                                <a class="navbar-item">
                                    My Bookings
                                </a>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        Tennis Court Scheduler
                    </h1>
                    <h2 class="subtitle">
                        Queens Club Gardens
                    </h2>
                </div>
            </div>
        </section>
        <router-view />
    </div>
</template>

<style lang="css">
.hero {
  margin-bottom: 50px;
}
</style>