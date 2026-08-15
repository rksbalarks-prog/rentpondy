allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}
subprojects {
    project.evaluationDependsOn(":app")
}

// Some Flutter plugins (geolocator, geocoding, image_picker) ship AARs that
// must be compiled against a newer Android API than Flutter's default here
// (33) — e.g. image_picker_android needs 36. The app module sets its own
// compileSdk, but plugin modules don't, so force every Android subproject up.
// Reflection avoids needing the Android Gradle Plugin types on this classpath.
subprojects {
    val forceCompileSdk = {
        if (project.hasProperty("android")) {
            val android = project.extensions.getByName("android")
            android.javaClass
                .getMethod("compileSdkVersion", Integer.TYPE)
                .invoke(android, 36)
        }
    }
    // The earlier `evaluationDependsOn(":app")` can leave some projects already
    // evaluated, and afterEvaluate throws on those — apply directly instead.
    if (state.executed) forceCompileSdk() else afterEvaluate { forceCompileSdk() }
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
