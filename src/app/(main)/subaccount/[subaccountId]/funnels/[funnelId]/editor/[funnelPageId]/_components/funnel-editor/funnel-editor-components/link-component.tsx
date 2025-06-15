'use client'
import { Badge } from '@/components/ui/badge'
import { EditorBtns } from '@/lib/constants'

import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import Link from 'next/link'

import React, { useRef } from 'react'

type Props = {
  element: EditorElement
}

const LinkComponent = (props: Props) => {
  const { dispatch, state } = useEditor()

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return
    e.dataTransfer.setData('componentType', type)
  }

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: props.element,
      },
    })
  }

  const styles = props.element.styles

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { elementDetails: props.element },
    })
  }

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e, 'text')}
      onClick={handleOnClickBody}
      className={clsx(
        'p-[2px] w-full m-[5px] relative text-[16px] transition-all',
        {
          '!border-blue-500':
            state.editor.selectedElement.id === props.element.id,

          '!border-solid': state.editor.selectedElement.id === props.element.id,
          'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
        }
      )}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      {!Array.isArray(props.element.content) &&
        (state.editor.previewMode || state.editor.liveMode) && (
          <Link href={props.element.content.href || '#'}>
            {props.element.content.innerText}
          </Link>
        )}
      {!state.editor.previewMode && !state.editor.liveMode && (
  <div className="flex flex-col gap-1">
    {/* Editable Link Text */}
    <span
      contentEditable
      suppressContentEditableWarning
      className="outline-none border border-dashed px-1 py-0.5"
      onBlur={(e) => {
        const spanElement = e.target as HTMLSpanElement
        dispatch({
          type: 'UPDATE_ELEMENT',
          payload: {
            elementDetails: {
              ...props.element,
              content: {
                ...props.element.content,
                innerText: spanElement.innerText,
              },
            },
          },
        })
      }}
    >
      {!Array.isArray(props.element.content) &&
        props.element.content.innerText}
    </span>

    {/* Editable HREF URL Input */}
    <input
      type="text"
      placeholder="Enter URL (https://...)"
      className="border px-2 py-1 rounded text-sm"
      defaultValue={
        !Array.isArray(props.element.content)
          ? props.element.content.href
          : ''
      }
      onBlur={(e) => {
        const newHref = e.target.value
        dispatch({
          type: 'UPDATE_ELEMENT',
          payload: {
            elementDetails: {
              ...props.element,
              content: {
                ...props.element.content,
                href: newHref,
              },
            },
          },
        })
      }}
    />
  </div>
)}

      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  )
}

export default LinkComponent
