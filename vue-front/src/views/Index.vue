<template>


    <section class="block block--dark">
        <div class="container">
            <div class="block__inner">
                <div class="block__header">
                    <h2 class="block__title">Возможности</h2>
                </div>
                <div class="block__body">
                    установка
                </div>
            </div>
        </div>
    </section>

    <section class="block block--filled">
        <div class="container">
            <div class="block__inner">
                <div class="block__header">
                    <h2 class="block__title">Установка</h2>
                </div>
                <div class="block__body">
                    установка
                </div>
            </div>
        </div>
    </section>

    <section class="block">
        <div class="container">
            <div class="block__inner">
                <div class="block__header">
                    <h2 class="block__title">Сформировать конфиг для новой метрики</h2>
                </div>
                <div class="block__body">
                    <MetricAdjutant />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import MetricAdjutant from "../components/MetricAdjutant.vue";

    export default {
        name: "Index",
        components: {
            MetricAdjutant
        }

    }
</script>

<style lang="scss">

</style>