export default function SellerListSkeleton() {
  return (
    <div className="grid gap-3 sm:gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <SellerCardSkeleton key={index} />
      ))}
    </div>
  );
}

function SellerCardSkeleton() {
  return (
    <article
      className="
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-surface
        shadow-[0_2px_12px_rgba(0,0,0,0.04)]
      "
    >

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div
              className="
                h-12
                w-12
                shrink-0
                animate-pulse
                rounded-xl
                bg-surface-muted
              "
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="
                    h-4
                    w-28
                    animate-pulse
                    rounded-md
                    bg-surface-muted
                  "
                />

                <div
                  className="
                    h-5
                    w-16
                    animate-pulse
                    rounded-full
                    bg-primary-light
                  "
                />
              </div>

              <div
                className="
                  mt-2
                  h-3
                  w-40
                  max-w-full
                  animate-pulse
                  rounded
                  bg-surface-muted
                "
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div
              className="
                h-4
                w-12
                animate-pulse
                rounded
                bg-surface-muted
              "
            />

            <div
              className="
                h-8
                w-8
                animate-pulse
                rounded-full
                bg-surface-muted
              "
            />
          </div>
        </div>
      </div>

      <div
        className="
          border-y
          border-border/70
          bg-surface-muted/60
          px-4
          py-3

          sm:mx-4
          sm:rounded-xl
          sm:border
        "
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="
                h-7
                w-7
                animate-pulse
                rounded-lg
                bg-primary-light
              "
            />

            <div
              className="
                h-3.5
                w-28
                animate-pulse
                rounded
                bg-surface-muted
              "
            />
          </div>

          <div
            className="
              h-6
              w-12
              animate-pulse
              rounded-full
              bg-primary-light
            "
          />
        </div>

        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                gap-3
                rounded-xl
                bg-white
                p-2.5
              "
            >
              <div
                className="
                  h-12
                  w-12
                  shrink-0
                  animate-pulse
                  rounded-lg
                  bg-surface-muted
                "
              />

              <div className="min-w-0 flex-1">
                <div
                  className="
                    h-3.5
                    w-24
                    animate-pulse
                    rounded
                    bg-surface-muted
                  "
                />

                <div
                  className="
                    mt-2
                    h-3
                    w-28
                    animate-pulse
                    rounded
                    bg-surface-muted
                  "
                />
              </div>

              <div className="shrink-0 text-right">
                <div
                  className="
                    ml-auto
                    h-4
                    w-14
                    animate-pulse
                    rounded
                    bg-primary-light
                  "
                />

                <div
                  className="
                    ml-auto
                    mt-1
                    h-2.5
                    w-8
                    animate-pulse
                    rounded
                    bg-surface-muted
                  "
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4">
        <div
          className="
            h-11
            animate-pulse
            rounded-xl
            bg-primary-light
          "
        />

        <div
          className="
            h-11
            animate-pulse
            rounded-xl
            bg-surface-muted
          "
        />
      </div>
    </article>
  );
}