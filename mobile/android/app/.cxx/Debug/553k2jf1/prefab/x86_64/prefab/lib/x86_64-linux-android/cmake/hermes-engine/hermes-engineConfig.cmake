if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/home/ravel/.gradle/caches/8.14.3/transforms/489230f37abb5e33c109b4c4b32f3c92/transformed/hermes-android-250829098.0.14-debug/prefab/modules/hermesvm/libs/android.x86_64/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/ravel/.gradle/caches/8.14.3/transforms/489230f37abb5e33c109b4c4b32f3c92/transformed/hermes-android-250829098.0.14-debug/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

