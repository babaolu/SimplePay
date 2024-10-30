import SidePane from "./components/sidepane"

export default function Template({ children }: { children: React.ReactNode }) {
    return <div
      className="flex h-screen">
        <SidePane/>
        {children}
      </div>
  }