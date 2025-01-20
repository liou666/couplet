import { Outlet, useNavigate } from 'react-router'
import TitleBar from '../title-bar'

export default function MainLayout() {
  const navigate = useNavigate()

  return (
    <div className="h-screen flex flex-col ">
      <div className="h-9">
        <TitleBar />
      </div>
      <main className="flex h-full">
        <nav className="w-[50px] border-r p-2 h-full flex flex-col">
          <button onClick={() => navigate('/chat')} className="size-8 p-1.5 bg-accent rounded flex justify-center items-center gap-2">
            <i className="i-mingcute-chat-3-line w-full h-full" />
          </button>
          <button onClick={() => navigate('/chat/123')} className="size-8 p-1.5 flex justify-center items-center">
            <i className="i-mingcute-grid-line w-full h-full" />
          </button>
          <button className="size-8 p-1.5 mt-auto flex justify-center items-center">
            <i className="i-mingcute-settings-1-line w-full h-full" />
          </button>
        </nav>
        <section>
          <Outlet />
        </section>
      </main>
      {/* <footer>

      </footer> */}

    </div>
  )
}
