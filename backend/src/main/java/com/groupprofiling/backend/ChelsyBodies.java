package com.groupprofiling.backend;

import java.util.List;

final class ChelsyBodies {
    static final String COVER_IMAGE = "/images/night-run.jpg";

    public record Zone(String id, String label, String group, String color) {}
    record Person(String id, String name, String zone, String description) {}

    static final List<Zone> ZONES = List.of(
            new Zone("campus", "Campus Gate", "Campus life", "#79eaba"),
            new Zone("after-hours", "After Hours", "Screen time", "#c4d77c"),
            new Zone("canteen", "Canteen", "Food & chika", "#eebb83"),
            new Zone("commute", "Uwi Trail", "Getting home", "#c1a8fa"),
            new Zone("pogi", "Pogi Corner", "Sigma rizz era", "#f0a9d0"),
            new Zone("pacute", "Soft Side", "For PJ", "#ff94ad"),
            new Zone("cameo", "For You Feed", "Wild cards", "#8ebff5")
    );

    static final List<Person> PEOPLE = List.of(
            side("recitation", "Recitation: Chelsy", "campus",
                    "A side of me sa school, most of the time nire-rehearse ko pa ’yung sagot sa isip ko, sa tagal ko mag isip nasa next question na lala. SOBRANG BAGAL PA NANG NET NAMIN!"),
            side("doomscroll", "Doomscroll Chelsy", "after-hours",
                    "Sabi ko talaga last scroll na, e may nakita akong AI drama, ayun pumikit saglit, alas tres na"),
            side("ipad-kid", "iPad Kid Chelsy", "after-hours",
                    "Me kapag di makapag laro kasi ang daming schoolworks t-t hays sagabal talaga pag aaral sa pag lalaro"),
            side("gutom", "Gutom Chelsy", "canteen",
                    "Lamon lang ng lamon hanggat wala pang pinapa aral"),
            side("chismosa", "Chismosa Chelsy", "canteen",
                    "Sana sine-neen mo na lang ako. Buong weekend ko pa ’tong iisipin hays. Ayoko sa lahat yung binibitin ako e"),
            side("uwi", "Uwing-Uwi Na ’Ko Chelsy", "commute",
                    "Pag dismissal, unang una umalis, Kung gaano ako kabilis lumabas, gano’n katagal ’yung jeep pa-Dimasalang"),
            side("backrider", "Studyante sa Umaga, Backrider sa Gabi (Naulanan)", "commute",
                    "Araw araw na lang pinapagod ng mundo, mamatay na sana mga kurakot"),
            side("pogi", "Pogi Chelsy", "pogi",
                    "GIGA CHAD!!! HUSBANDAT SIGMA BOY!"),
            side("pacute", "Pa-Cute Chelsy", "pacute",
                    "Only legends lang nakakaalam ng side ko na ’to. Tuff sa iba, baby girl sa kanya."),
            side("adik", "Adik Chelsy", "cameo",
                    "Maga lang kakaiyak, Ba’t ang dami n’yong tanong?"),
            side("weirdo", "Weirdo Chelsy", "cameo",
                    "Eh ganon talaga, nakikitira lang kayo sa mundo ko, kaya bawal magreklamo"),
            side("rene", "Rene Batterbonia", "cameo",
                    "HALA GAGI MALI BAT ANDITO TOOO?")
    );

    private ChelsyBodies() {}

    private static Person side(String id, String name, String zone, String description) {
        return new Person(id, name, zone, description);
    }
}