export function HeaderNumber({ number, title }: { number: string, title: string }) {
    return (
        <div className="p-4 bg-primary flex items-center">
            <div className="w-8 h-8 bg-card rounded-full flex items-center justify-center text-card-foreground font-bold shadow-md">
                {number}
            </div>
            <h2 className="ml-2 text-primary-foreground font-medium">{title}</h2>
        </div>
    )
}